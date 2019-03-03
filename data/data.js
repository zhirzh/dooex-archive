const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mongoose = require('mongoose');

const db = require('./db');

const rawDoodlesDirPath = path.resolve(__dirname, 'raw');

const allUniqueCountries = {};
const allUniqueTags = {};

const allCountriesIds = {};
const allTagsIds = {};

let prevPromise = db.drop();

/**
 * @param {string} processName
 * @param {fraction} number
 */
function logProgress(processName, fraction) {
  const range = 100;
  const progress = Math.floor(fraction * range);

  process.stdout.write(`${processName}: ${progress}%\r`);

  if (fraction === 1) {
    process.stdout.write(`${processName}: ${progress}%\r`);

    console.log('\n');
  }
}

/**
 * Generate unique and consistent hash for Doodles
 * @param {Doodle} doodle - Doodle to generate hash for.
 * @returns {string}
 */
function generateDoodleHash(doodle) {
  // NEVER CHANGE THIS
  return crypto
    .createHash('md5')
    .update(`[${doodle.name}](${doodle.url})`, 'ascii')
    .digest('hex');
}

/**
 * Resolve relative URLs with `https://www.google.com`
 * @param {string} URL
 */
function resolveUrl(URL) {
  if (URL.length === 0) {
    return null;
  }

  return url.resolve('https://www.google.com', URL);
}

/**
 * Persist Country and Tag
 */
function persist(Model, values) {
  let persistTarget;
  switch (Model) {
    case db.Country:
      persistTarget = allCountriesIds;
      break;

    case db.Tag:
      persistTarget = allTagsIds;
      break;

    default:
      throw Error();
  }

  for (let i = 0; i < values.length; i += 1) {
    prevPromise = prevPromise.then(async () => {
      const value = values[i];
      persistTarget[value] = await Model.create({ value });

      logProgress(Model.collection.name, (i + 1) / values.length);
      return Promise.resolve();
    });
  }

  return prevPromise;
}

/**
 * Persist data to database
 * @param {Doodle[]} allDoodles
 * @param {Country[]} allCountries
 * @param {Tag[]} allTags
 */
async function persistData(allDoodles, allCountries, allTags) {
  await persist(db.Country, allCountries);
  await persist(db.Tag, allTags);

  for (let i = 0; i < allDoodles.length; i += 1) {
    prevPromise = prevPromise.then(async () => {
      logProgress(db.Doodle.collection.name, (i + 1) / allDoodles.length);

      const doodle = allDoodles[i];

      return db.Doodle.create(doodle);
    });
  }

  await prevPromise;

  mongoose.disconnect();
}

const allRawDoodles = fs
  .readdirSync(rawDoodlesDirPath)
  .map(filename => path.resolve(rawDoodlesDirPath, filename))
  .reduce((_allRawDoodles, filepath) => {
    const fileDoodles = JSON.parse(fs.readFileSync(filepath)).reverse();

    return _allRawDoodles.concat(fileDoodles);
  }, [])
  .reverse();

const allDoodles = allRawDoodles.map((rawDoodle) => {
  const doodle = {};

  // same keys
  const keys = ['name', 'title'];

  keys.forEach((k) => {
    doodle[k] = rawDoodle[k];
  });

  // modified keys
  doodle.high_res_url = resolveUrl(rawDoodle.high_res_url);
  doodle.url = resolveUrl(rawDoodle.url);
  doodle.standalone_html = resolveUrl(rawDoodle.standalone_html);

  // new keys
  doodle.id = generateDoodleHash(rawDoodle);
  doodle.aspect = rawDoodle.width / rawDoodle.height;

  doodle.date = new Date(Date.UTC(
    rawDoodle.run_date_array[0],
    rawDoodle.run_date_array[1] - 1,
    rawDoodle.run_date_array[2],
  ));

  if (rawDoodle.is_animated_gif) {
    doodle.type = 'animated';
  } else if (rawDoodle.is_dynamic) {
    doodle.type = 'interactive';
  } else {
    doodle.type = 'simple';
  }

  // association keys
  const countriesHash = {};
  doodle.countries = rawDoodle.countries.forEach((country) => {
    country = country.toLowerCase(); // eslint-disable-line no-param-reassign

    countriesHash[country] = true;
    allUniqueCountries[country] = true;
  });
  doodle.countries = Object.keys(countriesHash);

  const tagsHash = {};
  doodle.tags = rawDoodle.tags.forEach((tag) => {
    tag = tag.toLowerCase(); // eslint-disable-line no-param-reassign

    tagsHash[tag] = true;
    allUniqueTags[tag] = true;
  });
  doodle.tags = Object.keys(tagsHash);

  return doodle;
});

const allCountries = Object.keys(allUniqueCountries);
const allTags = Object.keys(allUniqueTags);

persistData(allDoodles, allCountries, allTags);

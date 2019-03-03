const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const url = require('url');

const db = require('./db');

function getDoodleHash(doodle) {
  // NEVER CHANGE THIS
  return crypto
    .createHash('md5')
    .update(`[${doodle.name}](${doodle.url})`, 'ascii')
    .digest('hex');
}

function resolveUrl(URL) {
  if (URL.length === 0) {
    return null;
  }

  return url.resolve('https://www.google.com', URL);
}

function persist(Model, values) {
  let prevPromise = Promise.resolve();

  const uniqueValues = Array.from(new Set(values));
  for (let i = 0; i < uniqueValues.length; i += 1) {
    prevPromise = prevPromise.then(async () => {
      console.log(Model, i);

      const value = uniqueValues[i];
      await Model.findOrCreate({ where: { value } });

      return Promise.resolve();
    });
  }

  return prevPromise;
}

const rawDoodlesDirPath = path.resolve(__dirname, 'raw');

(async function main() {
  await db.sequelize.sync(/*{ force: true }*/);
  let prevPromise = Promise.resolve();

  const allRawDoodles = fs
    .readdirSync(rawDoodlesDirPath)
    .map(filename => path.resolve(rawDoodlesDirPath, filename))
    .reduce((_allDoodles, filepath) => {
      const fileDoodles = JSON.parse(fs.readFileSync(filepath));

      return _allDoodles.concat(fileDoodles);
    }, []);

  const allDoodles = allRawDoodles.map(rawDoodle => {
    const doodle = {};

    // same keys
    const copyKeys = ['name', 'title'];

    copyKeys.forEach(k => {
      doodle[k] = rawDoodle[k];
    });

    // modified keys
    doodle.high_res_url = resolveUrl(rawDoodle.high_res_url);
    doodle.url = resolveUrl(rawDoodle.url);
    doodle.standalone_html = resolveUrl(rawDoodle.standalone_html);

    // new keys
    doodle.id = getDoodleHash(rawDoodle);
    doodle.aspect = rawDoodle.width / rawDoodle.height;

    doodle.date = new Date(Date.UTC(...rawDoodle.run_date_array));

    if (rawDoodle.is_animated_gif) {
      doodle.type = 'animated';
    } else if (rawDoodle.is_dynamic) {
      doodle.type = 'interactive';
    } else {
      doodle.type = 'simple';
    }

    // association keys
    doodle.countries = Array.from(
      new Set(rawDoodle.countries.map(country => country.toLowerCase())),
    );

    doodle.tags = Array.from(
      new Set(rawDoodle.tags.map(tag => tag.toLowerCase())),
    );

    return doodle;
  });

  await persist(
    db.Country,
    allDoodles.reduce(
      (allCountries, doodle) => allCountries.concat(doodle.countries),
      [],
    ),
  );

  await persist(
    db.Tag,
    allDoodles.reduce((allTags, doodle) => allTags.concat(doodle.tags), []),
  );

  for (let i = 0; i < allDoodles.length; i += 1) {
    prevPromise = prevPromise.then(async () => {
      try {
        console.log(i);

        const doodle = allDoodles[i];

        const [doodleRecord, isCreated] = await db.Doodle.findOrCreate({
          where: {
            id: doodle.id,
          },

          defaults: {
            aspect: doodle.aspect,
            date: doodle.date,
            high_resUrl: doodle.high_res_url,
            name: doodle.name,
            standaloneHtml: doodle.standalone_html,
            title: doodle.title,
            type: doodle.type,
            url: doodle.url,
          },
        });

        if (isCreated) {
          await doodleRecord.setCountries(doodle.countries);
          await doodleRecord.setTags(doodle.tags);
        }
      } catch (err) {
        console.log(err);
      }

      return Promise.resolve();
    });
  }
})();

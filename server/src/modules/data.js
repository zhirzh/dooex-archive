import db from '../../../data/db';

const { Doodle, Country, Tag } = db;

let schema;

/**
 * @typedef Doodle
 * @property {string} id
 * @property {number} aspect
 * @property {Array<string>} countries
 * @property {Date} date
 * @property {string} high_res_url
 * @property {string} name
 * @property {string} standalone_html
 * @property {Array<string>} tags
 * @property {string} title
 * @property {string} type
 * @property {string} url
 */

/**
 * Populate `allDoodles` and `metaData`.
 */
async function init() {
  const allDoodles = await Doodle.find();

  // store `schema`
  schema = Object.keys(Doodle.schema.paths);

  // construct `metaData`
  const metaData = {
    countries: (await Country.find()).map(country => country.value),
    linkTypes: ['high_res_url', 'standalone_html', 'url'],
    schema,
    sliceSize: 10,
    tags: (await Tag.find()).map(tag => tag.value),
    urlPrefixes: ['https://lh3.googleusercontent.com', 'https://www.google.com/logos'],
  };

  // normalise links
  allDoodles.forEach((doodle) => {
    metaData.linkTypes.forEach((linkType) => {
      let link = doodle[linkType];

      if (link === null) {
        return;
      }

      for (let i = 0; i < metaData.urlPrefixes.length; i += 1) {
        if (link.startsWith(metaData.urlPrefixes[i])) {
          link = link.replace(metaData.urlPrefixes[i], i);
          break;
        }
      }

      doodle[linkType] = link;
    });
  });

  // normalise countrie and tags
  const doodlesCount = await Doodle.count();
  for (let i = 0; i < doodlesCount; i += 1) {
    const doodle = allDoodles[i];

    doodle.countries = doodle.countries.map(country => metaData.countries.indexOf(country));
    doodle.tags = doodle.tags.map(tag => metaData.tags.indexOf(tag));
  }

  console.log('ready');

  return {
    allDoodles,
    metaData,
  };
}

/**
 * Deflate doodle as per schema.
 * @param {Doodle} doodle
 * @param {Schema} schema
 */
function deflate(doodle) {
  return schema.map(key => doodle[key]);
}

const readyPromise = init();

export { deflate, init, readyPromise };

const db = require('../db');

const Country = db.Country;
const Doodle = db.Doodle;
const Tag = db.Tag;

let allDoodles;
let meta;

let prevPromise = Promise.resolve();

(async function init() {
  allDoodles = (await Doodle.all()).reverse();

  meta = {
    allCountries: (await Country.all()).map(country => country.value),
    allTags: (await Tag.all()).map(tag => tag.value),
    allTypes: Array.from(new Set(allDoodles.map(doodle => doodle.type))),
    linkTypes: ['high_resUrl', 'standaloneHtml', 'url'],
    schema: [
      ...Object.keys(Doodle.attributes),
      ...Object.keys(Doodle.associations),
    ],
    sliceSize: 10,
    urlPrefixes: {
      0: 'https://www.google.com/logos/doodles',
      1: 'https://www.google.com/logos',
      2: 'https://lh3.googleusercontent.com',
    },
  };

  allDoodles.forEach(doodle => {
    meta.linkTypes.forEach(linkType => {
      let link = doodle[linkType];

      if (link === null) {
        return;
      }

      switch (true) {
        case link.startsWith(meta.urlPrefixes[0]):
          link = link.replace(meta.urlPrefixes[0], 0);
          break;

        case link.startsWith(meta.urlPrefixes[1]):
          link = link.replace(meta.urlPrefixes[1], 1);
          break;

        case link.startsWith(meta.urlPrefixes[2]):
          link = link.replace(meta.urlPrefixes[2], 2);
          break;

        default:
          throw Error();
      }

      doodle[linkType] = link;
    });
  });

  const doodlesCount = await Doodle.count();
  for (let i = 0; i < doodlesCount; i += 1) {
    prevPromise = prevPromise.then(async () => {
      const doodle = allDoodles[i];

      const countries = await doodle.getCountries();
      doodle.countries = countries.map(country =>
        meta.allCountries.indexOf(country.value),
      );

      const tags = await doodle.getTags();
      doodle.tags = tags.map(tag => meta.allTags.indexOf(tag.value));

      return Promise.resolve();
    });
  }

  await prevPromise;
  console.log('ready');
})();

async function data(req, resp) {
  const sliceSize = req.params.sliceSize;

  try {
    await prevPromise;

    const doodleSlice =
      sliceSize === undefined ? allDoodles : allDoodles.slice(0, sliceSize);

    resp.json(doodleSlice.map(doodle => meta.schema.map(key => doodle[key])));
  } catch (err) {
    console.error(err);
  }
}

function metaData(req, resp) {
  resp.send(meta);
}

module.exports = {
  data,
  metaData,
};

const fs = require('fs');
const path = require('path');


const dataPath = path.resolve(__dirname, 'data');
const rawDataPath = path.resolve(dataPath, 'raw');
const allRawDoodlesPath = path.resolve(dataPath, 'doodles.raw.all.json');


const allCountriesPath = path.resolve(dataPath, 'countries.all.json');
const allDoodlesPath = path.resolve(dataPath, 'doodles.all.json');
const allTagsPath = path.resolve(dataPath, 'tags.all.json');
const schemaPath = path.resolve(dataPath, 'schema.json');


const allCountries = JSON.parse(fs.readFileSync(allCountriesPath));
const allDoodles = JSON.parse(fs.readFileSync(allDoodlesPath));
const allTags = JSON.parse(fs.readFileSync(allTagsPath));
const schema = JSON.parse(fs.readFileSync(schemaPath));


allDoodles.map((doodle, i) => {
  allDoodles[i] = {};

  schema.forEach((key, j) => {
    allDoodles[i][key] = doodle[j];
  });

  allDoodles[i].countries = allDoodles[i].countries.map(cIdx => allCountries[cIdx]);
  allDoodles[i].tags = allDoodles[i].tags.map(tIdx => allTags[tIdx]);
});

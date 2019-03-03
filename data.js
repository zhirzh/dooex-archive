const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rawUrlPrefixes = {
  0: '//www.google.com/logos/doodles',
  1: '//www.google.com/logos',
  2: '/logos',
  3: 'https://lh3.googleusercontent.com',
};

const meta = {
  allCountries: [],
  allTags: [],
  allTypes: ['simple', 'animated', 'interactive'],
  schema: [],
  sliceSize: 10,
  linkTypes: [
    'alternate_url',
    'call_to_action_image_url',
    'hires_url',
    'standalone_html',
    'url',
  ],
  urlPrefixes: {
    0: 'https://www.google.com/logos/doodles',
    1: 'https://www.google.com/logos',
    2: 'https://lh3.googleusercontent.com',
  },
};


const dataDirPath = path.resolve(__dirname, 'data');
const rawDirPath = path.resolve(dataDirPath, 'raw');
const allRawDoodlesPath = path.resolve(dataDirPath, 'doodles.raw.all.json');

const dataPath = path.resolve(dataDirPath, 'data.json');
const dataSlicePath = path.resolve(dataDirPath, `data-${meta.sliceSize}.json`);
const metaPath = path.resolve(dataDirPath, 'meta.json');

function lexicalSort(a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

function getDoodleHash(doodle) {
  return crypto.createHash('md5').update(`[${doodle.name}](${doodle.url})`, 'ascii').digest('hex');
}

function aggregate() {
  let allRawDoodles = [];

  fs.readdirSync(rawDirPath)
    .forEach((fileName) => {
      const filePath = path.resolve(rawDirPath, fileName);

      const someDoodles = JSON.parse(fs.readFileSync(filePath));
      allRawDoodles = allRawDoodles.concat(someDoodles);
    });

  fs.writeFileSync(allRawDoodlesPath, JSON.stringify(allRawDoodles));
}

function normalise() {
  meta.schema = [
    /*
    'alternate_url',
    'blog_text',
    'call_to_action_image_url',
    'collection_id',
    'doodle_args',
    'hires_height',
    'hires_url',
    'hires_width',
    'history_doodles',
    'is_global',
    'is_highlighted',
    'next_doodle',
    'prev_doodle',
    'query',
    'related_doodles',
    'share_text',
    'translations',
    'youtube_id',
    */

    'aspect',
    'countries',
    'id',
    'name',
    'persistent_id',
    'run_date_array',
    'standalone_html',
    'tags',
    'title',
    'type',
    'url',

    /*
    id => gid
    id = getDoodleHash()

    doodle_type => type
    type = simple
    is_animated_gif === true => type = isAnimated
    is_dynamic === true => type = interactive

    aspect = width / height
    */
  ];

  const allRawDoodles = JSON.parse(fs.readFileSync(allRawDoodlesPath));


  const allDoodleHashes = allRawDoodles.reduce((_allDoodleHashes, doodle) => {
    const doodleHash = getDoodleHash(doodle);
    _allDoodleHashes[doodleHash] = doodle.persistent_id;

    return _allDoodleHashes;
  }, {});


  meta.allCountries = allRawDoodles.reduce((_allCountries, doodle) => {
    doodle.countries.map(country => country.trim().toLowerCase())
      .forEach((country) => {
        if (_allCountries.includes(country)) {
          return;
        }

        _allCountries.push(country);
      });

    return _allCountries;
  }, []).sort(lexicalSort);


  meta.allTags = allRawDoodles.reduce((_allTags, doodle) => {
    doodle.tags.map(tag => tag.trim().toLowerCase())
      .forEach((tag) => {
        if (_allTags.includes(tag)) {
          return;
        }

        _allTags.push(tag);
      });

    return _allTags;
  }, []).sort(lexicalSort);


  const allDoodles = allRawDoodles.map((doodle) => {
    doodle.id = getDoodleHash(doodle);

    doodle.countries = doodle.countries
      .map(country => country.toLowerCase())
      .map(country => meta.allCountries.indexOf(country));

    doodle.tags = doodle.tags
      .map(tag => tag.toLowerCase())
      .map(tag => meta.allTags.indexOf(tag));

    return doodle;
  })
  .map((doodle) => {
    if (doodle.next_doodle !== null) {
      const nextDoodleHash = getDoodleHash(doodle.next_doodle);
      doodle.next_doodle = allDoodleHashes[nextDoodleHash];
    }

    if (doodle.prev_doodle !== null) {
      const prevDoodleHash = getDoodleHash(doodle.prev_doodle);
      doodle.prev_doodle = allDoodleHashes[prevDoodleHash];
    }

    doodle.related_doodles = doodle.related_doodles
      .map((relatedDoodle) => {
        const relatedDoodleHash = getDoodleHash(relatedDoodle);

        return allDoodleHashes[relatedDoodleHash];
      });

    doodle.history_doodles = doodle.history_doodles
      .map((historyDoodle) => {
        const historyDoodleHash = getDoodleHash(historyDoodle);

        return allDoodleHashes[historyDoodleHash];
      });

    return doodle;
  })
  .map((doodle) => {
    doodle.type = 'simple';

    if (doodle.is_animated_gif) {
      doodle.type = 'animated';
    }

    if (doodle.is_dynamic) {
      doodle.type = 'interactive';
    }

    doodle.aspect = doodle.width / doodle.height;

    return doodle;
  })
  .map((doodle) => {
    meta.linkTypes.forEach((linkType) => {
      if (doodle[linkType].startsWith(rawUrlPrefixes[0])) {
        doodle[linkType] = doodle[linkType].replace(rawUrlPrefixes[0], 0);
      }

      // rawUrlPrefixes @1 and @2 represent the same global url -> meta.urlPrefixes @1
      if (doodle[linkType].startsWith(rawUrlPrefixes[1])) {
        doodle[linkType] = doodle[linkType].replace(rawUrlPrefixes[1], 1);
      }
      if (doodle[linkType].startsWith(rawUrlPrefixes[2])) {
        doodle[linkType] = doodle[linkType].replace(rawUrlPrefixes[2], 1);
      }

      // shift meta.urlPrefixes index by 1 because above
      if (doodle[linkType].startsWith(rawUrlPrefixes[3])) {
        doodle[linkType] = doodle[linkType].replace(rawUrlPrefixes[3], 2);
      }
    });

    return doodle;
  })
  .map(doodle => meta.schema.map(key => doodle[key]));


  fs.writeFileSync(dataSlicePath, JSON.stringify(allDoodles.slice(-1 * meta.sliceSize)));
  fs.writeFileSync(dataPath, JSON.stringify(allDoodles));
  fs.writeFileSync(metaPath, JSON.stringify(meta));
}

aggregate();
normalise();

const fs = require('fs');

function lexicalSort(x, y) {
  return x.toLowerCase().localeCompare(y.toLowerCase());
}

const doodles = fs.readdirSync('raw')
  .filter(file => file.endsWith('.json'))
  .reduce((res, file) => res.concat(JSON.parse(fs.readFileSync(`raw/${file}`))), []);

const doodlesByUrl = doodles.reduce((res, d) => {
  res[d.url] = d;

  return res;
}, {});

const meta = {
  countries: [],
  schema: [],
  tags: [],
  types: [],
  urlPrefixes: [],
};


/*
  modify meta
*/
meta.schema = [
  // 'alternate_url',
  // 'blog_text',
  // 'call_to_action_image_url',
  // 'collection_id',
  // 'doodle_args',
  // 'height',
  // 'hires_height',
  // 'hires_url',
  // 'hires_width',
  // 'history_doodles',
  // 'is_dynamic',
  // 'is_global',
  // 'is_highlighted',
  // 'next_doodle',
  // 'persistent_id',
  // 'prev_doodle',
  // 'query',
  // 'related_doodles',
  // 'share_text',
  // 'translations',
  // 'width',
  // 'youtube_id',

  'countries',
  'name',
  'run_date_array',
  'standalone_html',
  'tags',
  'title',
  'url',

  /* replace google provided id with local id */
  'id',

  /* replace `is_animated_gif` with `type[animated]`` */
  // 'is_animated_gif',

  /* replace `doodle_type` with `type` */
  // 'doodle_type',
  'type',
];

meta.urlPrefixes = [
  '//www.google.com/logos/',
  '/logos/',
  'https://lh3.googleusercontent.com/',
];

doodles.forEach((doodle) => {
  doodle.countries.forEach((country) => {
    if (meta.countries.includes(country)) {
      return;
    }

    meta.countries.push(country);
  });

  doodle.tags.forEach((tag) => {
    if (meta.tags.includes(tag)) {
      return;
    }

    meta.tags.push(tag);
  });

  if (meta.types.includes(doodle.doodle_type)) {
    return;
  }

  meta.types.push(doodle.doodle_type);
});

meta.types.push('animated');

meta.countries = meta.countries.sort(lexicalSort);
meta.tags = meta.tags.sort(lexicalSort);
meta.types = meta.types.sort(lexicalSort);


/*
  modify doodles
*/
const deflatedDoodles = doodles
  // .slice(2000, 2000 + 1)

  .map((doodle, id) => {
    doodle.id = id;
    doodle.type = doodle.doodle_type;

    doodle.countries = doodle.countries.map(country => meta.countries.indexOf(country));
    doodle.tags = doodle.tags.map(tag => meta.tags.indexOf(tag));
    doodle.type = meta.types.indexOf(doodle.type);

    if (doodle.is_animated_gif) {
      doodle.type = meta.types.indexOf('animated');
    }

    return doodle;
  })

  .map((doodle) => {
    doodle.next_doodle = doodle.next_doodle ? doodlesByUrl[doodle.next_doodle.url].id : null;
    doodle.prev_doodle = doodle.prev_doodle ? doodlesByUrl[doodle.prev_doodle.url].id : null;

    doodle.related_doodles = doodle.related_doodles.map(rd => doodlesByUrl[rd.url].id);
    doodle.history_doodles = doodle.history_doodles.map(hd => doodlesByUrl[hd.url].id);

    return doodle;
  })

  .map((doodle) => {
    [
      'alternate_url',
      'standalone_html',
      'call_to_action_image_url',
      'hires_url',
      'url',
    ].forEach((urlType) => {
      if (doodle[urlType].startsWith(meta.urlPrefixes[0])) {
        doodle[urlType] = doodle[urlType].replace(meta.urlPrefixes[0], 0);
      }

      if (doodle[urlType].startsWith(meta.urlPrefixes[1])) {
        doodle[urlType] = doodle[urlType].replace(meta.urlPrefixes[1], 0);
      }

      if (doodle[urlType].startsWith(meta.urlPrefixes[2])) {
        doodle[urlType] = doodle[urlType].replace(meta.urlPrefixes[2], 1);
      }
    });

    return doodle;
  })

  .map(doodle => meta.schema.map(k => doodle[k]));

meta.urlPrefixes[0] = 'https://www.google.com/logos/';
meta.urlPrefixes[1] = meta.urlPrefixes[2];
meta.urlPrefixes.splice(2, 1);

fs.writeFileSync('final/doodles-data.json', JSON.stringify(deflatedDoodles));
fs.writeFileSync('final/doodles-meta.json', JSON.stringify(meta));

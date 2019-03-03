// @flow

import type { Doodle, Meta } from 'modules/types';

type DeflatedDoodle = Array<any>;

type DoodlesState = Array<Doodle>;

type MetaState = Meta & {
  savedDoodleIds: Array<string>,
};

function inflateDoodles(deflatedDoodles: Array<DeflatedDoodle>, meta: MetaState): DoodlesState {
  const {
    countries, linkTypes, savedDoodleIds, schema, tags, urlPrefixes,
  } = meta;

  const doodles = deflatedDoodles.map((_, i) => {
    const doodle = {};

    schema.forEach((key, j) => {
      doodle[key] = deflatedDoodles[i][j];
    });

    linkTypes
      // $FlowFixMe
      .filter(linkType => schema.includes(linkType))
      .filter(linkType => doodle[linkType] !== null)
      .forEach((linkType) => {
        const urlPrefixIdx = doodle[linkType][0];

        const urlPrefix = urlPrefixes[urlPrefixIdx];
        doodle[linkType] = doodle[linkType].replace(urlPrefixIdx, urlPrefix);
      });

    doodle.countries = doodle.countries.map(cIdx => countries[cIdx]);
    doodle.tags = doodle.tags.map(tIdx => tags[tIdx]);

    doodle.date = new Date(doodle.date);

    doodle.isSaved = savedDoodleIds.includes(doodle.id);

    return doodle;
  });

  return doodles;
}

export default inflateDoodles;

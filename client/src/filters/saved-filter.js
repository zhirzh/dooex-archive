// @flow

import type { Doodle } from 'modules/types';

function savedFilter(doodles: Array<Doodle>): Array<Doodle> {
  const matchingDoodles = doodles.filter(doodle => doodle.isSaved);

  return matchingDoodles;
}

export default savedFilter;

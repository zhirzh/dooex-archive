import React from 'react';
import { Link } from 'react-router';

import { basename } from 'routes';

import styles from 'styles/Doodle.scss';

function renderStatic(text) {
  return <span className="tag tag-default float-xs-right">{text}</span>;
}

function renderRunDate(runDateArray) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const runDate = new Date(runDateArray);
  const runDateString = `${runDate.getDate()} ${months[runDate.getMonth()]}, ${runDate.getFullYear()}`;

  return renderStatic(runDateString);
}

function renderStats(filterKey, data, filter, nullMsg = '') {
  if (data.length === 0) {
    return renderStatic(nullMsg);
  }

  return data.map((d, i) => (
    <Link
      key={i}
      className="tag tag-info float-xs-right"
      to={{
        pathname: basename,
        query: {
          ...filter,
          [filterKey]: d,
        },
      }}
    >
      {d}
    </Link>
  ));
}

const DoodleStats = ({ doodle, filter }) => (
  <div className="card-block">
    <ul className="list-group list-group-flush">
      <li className={`list-group-item ${styles.stats}`}>
        Release Date
        <span className="float-xs-right">
          {renderRunDate(doodle.run_date_array)}
        </span>
      </li>

      <li className={`list-group-item ${styles.stats}`}>
        Doodle Type
        <span className="float-xs-right">
          {renderStats('type', [doodle.type], filter)}
        </span>
      </li>

      <li className={`list-group-item ${styles.stats}`}>
        Countries
        <span className="float-xs-right">
          {renderStats('country', doodle.countries, filter, 'No countries')}
        </span>
      </li>

      <li className={`list-group-item ${styles.stats}`}>
        Tags
        <span className="float-xs-right">
          {renderStats('tag', doodle.tags, filter, 'No countries')}
        </span>
      </li>
    </ul>
  </div>
);

export default DoodleStats;

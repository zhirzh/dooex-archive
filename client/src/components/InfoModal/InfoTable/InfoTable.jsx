// @flow

import type { Doodle } from 'modules/types';

import React from 'react';

import styles from './InfoTable.css';

function DataBadge({ item }: { item: string }) {
  return <span className={styles.badge}>{item}</span>;
}

function Row({ doodle, property }: { doodle: Doodle, property: string }) {
  const items = doodle[property];

  const DataBadges = items.map(item => <DataBadge key={item} item={item} />);

  return (
    <tr>
      <td className={styles.labelType}>{property}</td>

      <td>{DataBadges.length > 0 ? DataBadges : <span className="text-muted">None</span>}</td>
    </tr>
  );
}

function InfoTable({ doodle }: { doodle: Doodle }) {
  return (
    <table className={styles.root}>
      <tbody>
        <tr>
          <td className={styles.labelType}>Date</td>

          <td>
            {doodle.date
              .toDateString()
              .split(' ')
              .slice(1)
              .join(' ')}
          </td>
        </tr>

        <Row doodle={doodle} property="countries" />

        <Row doodle={doodle} property="tags" />
      </tbody>
    </table>
  );
}

export default InfoTable;

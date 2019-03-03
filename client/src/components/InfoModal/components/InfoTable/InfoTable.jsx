import React from 'react';

import styles from './InfoTable.scss';

function spaced(arr) {
  const nullComponent = <span className="text-muted">None</span>;
  return arr.reduce((prev, curr) => [prev, ' ', curr], null) || nullComponent;
}

function InfoTable(props) {
  return (
    <table className={styles.root}>
      <tbody>
        {props.keys.map(k =>
          (<tr key={k}>
            <td className={styles.labelType}>
              {k}
            </td>

            <td>
              {spaced(
                props.data[k].map(v =>
                  (<span key={v} className={styles.label}>
                    {v}
                  </span>),
                ),
              )}
            </td>
          </tr>),
        )}
      </tbody>
    </table>
  );
}

export default InfoTable;

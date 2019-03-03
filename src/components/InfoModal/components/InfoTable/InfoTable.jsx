import React from 'react';
import PropTypes from 'prop-types';

import styles from './InfoTable.css';

function spaced(arr) {
  const nullComponent = <span className="text-muted">None</span>;
  return arr.reduce((prev, curr) => [prev, ' ', curr], null) || nullComponent;
}

function InfoTable(props) {
  return (
    <table className={styles.root}>
      <tbody>
        {props.keys.map(k => (
          <tr key={k}>
            <td className={styles.labelType}>{k}</td>

            <td>
              {spaced(
                props.data[k].map(v => (
                  <span key={v} className={styles.label}>{v}</span>
                ))
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

InfoTable.propTypes = {
  data: PropTypes.object.isRequired,
  keys: PropTypes.array.isRequired,
};

export default InfoTable;

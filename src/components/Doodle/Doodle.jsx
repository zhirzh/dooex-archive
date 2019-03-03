import React from 'react';
import { withRouter } from 'react-router';

import { DoodleStats } from 'components';

import styles from 'styles/Doodle.scss';

function renderDoodleStats(doodle, filter) {
  return (
    <DoodleStats
      doodle={doodle}
      filter={filter}
    />
  );
}

const Doodle = ({
  doodle,
  toggleSave,
  renderToScreen,
  showSaved,
  location,
}) => (
  <div className="row">
    <div className="col-md-8 offset-md-2">
      <div className={`card ${styles.card}`}>
        <div className={`card-header ${styles.header}`}>
          <div className="col-md-10 col-sm-9 col-xs-9">
            <strong
              className={styles.title}
              title={doodle.title}
            >
              {doodle.title}
            </strong>
          </div>

          <div className="col-md-2 col-sm-3 col-xs-3">
            <label
              className="custom-control custom-checkbox float-xs-right"
              htmlFor={`save[${doodle.id}]`}
            >
              <input
                type="checkbox"
                className="custom-control-input"
                id={`save[${doodle.id}]`}
                name="type"
                checked={doodle.isSaved}
                onChange={toggleSave(doodle)}
              />
              <span className="custom-control-indicator" />
              Save
            </label>
          </div>
        </div>

        <div
          className={`card-block ${styles.img}`}
          data-toggle="modal"
          data-target="#modal"
          style={{ backgroundImage: `url(${doodle.url})` }}
          onClick={() => renderToScreen(doodle, showSaved)}
        />

        {renderDoodleStats(doodle, location.query)}
      </div>
    </div>
  </div>
);

export default withRouter(Doodle);

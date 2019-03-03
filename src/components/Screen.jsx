import React from 'react';

import styles from 'styles/Screen.scss';

function renderDoodle(doodle) {
  if (doodle.type === 'interactive') {
    return (
      <iframe src={doodle.standalone_html} />
    );
  }

  return (
    <img
      src={doodle.isSaved ? `./saved/?url=${doodle.url}` : doodle.url}
      alt={doodle.title}
    />
  );
}

const Screen = ({
  doodle,
  isHidden,
  hideScreen,
}) => {
  if (isHidden) {
    return null;
  }

  return (
    <div id={styles.screen}>
      <div id={styles.content}>
        {renderDoodle(doodle)}
      </div>

      <div id={styles.close} className="text-xs-right">
        <button onClick={hideScreen}>&times;</button>
      </div>
    </div>
  );
};

export default Screen;

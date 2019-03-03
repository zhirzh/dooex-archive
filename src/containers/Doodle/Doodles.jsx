import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { Doodle } from 'components';

import { updateSave } from 'modules/doodles';

import styles from 'styles/Doodle.scss';

function saveDoodle(doodle) {
  return fetch(doodle.url, { mode: 'no-cors' })
    .then(resp =>
      caches.open('DOOEX-saved-doodles').then(cache => cache.put(doodle.url, resp))
    );
}

function unsaveDoodle(doodle) {
  return caches.open('DOOEX-saved-doodles').then(cache => cache.delete(doodle.url));
}

const Doodles = ({
  className,
  doodles,
  renderToScreen,
  toggleSave,
}) => (
  <div className={className} id={styles.container}>
    {doodles.slice(-10).map((d, i) => (
      <Doodle
        key={i}
        doodle={d}

        toggleSave={toggleSave}
        renderToScreen={renderToScreen}
      />
    ))}
  </div>
);

const mapStateToProps = (state, ownProps) => {
  const filter = ownProps.location.query;
  const showSaved = filter.saved;

  const countries = state.doodles.countries;
  let doodles = state.doodles.doodles;

  if (showSaved) {
    doodles = doodles.filter(d => d.isSaved);
  }

  if (filter.country) {
    doodles = doodles.filter(d => d.countries.includes(filter.country));
  }

  if (filter.tag) {
    doodles = doodles.filter(d => d.tags.includes(filter.tag));
  }

  if (filter.type) {
    doodles = doodles.filter(d => (d.type === filter.type));
  }

  return {
    countries,
    doodles,
  };
};

const mapDispatchToProps = dispatch => ({
  toggleSave(doodle) {
    return (e) => {
      if (e.target.checked) {
        saveDoodle(doodle).then(() => dispatch(updateSave(doodle.id, true)));
      } else {
        unsaveDoodle(doodle).then(() => dispatch(updateSave(doodle.id, false)));
      }
    };
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Doodles));

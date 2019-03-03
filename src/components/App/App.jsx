import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import {
  Home,
  InfoModal,
  Screen,
  ScreenContainer,
} from 'components';

import styles from './App.css';

let prevLocation = null;

function App(props) {
  const isModal = !!(props.location.state && props.location.state.modal) && !!prevLocation;

  prevLocation = props.location;

  return (
    <div className={styles.root}>
      <Route
        exact={!isModal}
        path="/"
        render={() => <Home isModal={isModal} />}
      />

      <Route
        path="/screen/:doodleId"
        render={(routeProps) => {
          const Component = isModal ? Screen : ScreenContainer;

          return (
            <Component {...routeProps} isModal={isModal} />
          );
        }}
      />

      <Route
        path="/info/:doodleId"
        render={routeProps => (
          <div>
            {isModal ? null : <Home isModal={isModal} />}
            <InfoModal {...routeProps} isModal={isModal} />
          </div>
        )}
      />
    </div>
  );
}

App.propTypes = {
  location: PropTypes.object.isRequired,
};

export default App;

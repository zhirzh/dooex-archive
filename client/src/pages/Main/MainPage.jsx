// @flow

import React from 'react';
import Route from 'react-router/Route';

import FullScreen from 'components/FullScreen';
import InfoModal from 'components/InfoModal';
import Main from 'components/Main';
import Modal from 'components/Modal';
import NavBar from 'components/NavBar';

type Props = {
  basepath: string,
};

function withTrailingSlash(s: string) {
  return s.endsWith('/') ? s : `${s}/`;
}

function MainPage(props: Props) {
  const basepath = withTrailingSlash(props.basepath);

  return (
    <div>
      <Route
        path={`${basepath}info/:doodleId`}
        render={routeProps => (
          <Modal {...routeProps}>
            <InfoModal />
          </Modal>
        )}
      />

      <Route
        path={`${basepath}fullscreen/:doodleId`}
        render={routeProps => (
          <Modal {...routeProps}>
            <FullScreen />
          </Modal>
        )}
      />

      <Main />
    </div>
  );
}

export default MainPage;

import React from 'react';
import { Router, Route, browserHistory as history } from 'react-router';

import InfoModal from 'components/InfoModal';
import Expo from 'components/Expo';

import importComponent from 'import-component';

const importHomeLayout = (_, cb) => importComponent('layouts/Home', _, cb);
const importSearchLayout = (_, cb) => importComponent('layouts/Search', _, cb);
const importSavedLayout = (_, cb) => importComponent('layouts/Saved', _, cb);
const importTimeTravelLayout = (_, cb) => importComponent('layouts/TimeTravel', _, cb);

// const importInfoModal = (_, cb) => importComponent('components/InfoModal', _, cb);
// const importExpo = (_, cb) => importComponent('components/Expo', _, cb);

const router = (
  <Router history={history}>
    <Route path="/" getComponent={importHomeLayout}>
      <Route path="info/:doodleId" component={InfoModal} />
      <Route path="expo/:doodleId" component={Expo} />
    </Route>

    <Route path="search" getComponent={importSearchLayout}>
      <Route path="info/:doodleId" component={InfoModal} />
      <Route path="expo/:doodleId" component={Expo} />
    </Route>

    <Route path="saved" getComponent={importSavedLayout}>
      <Route path="info/:doodleId" component={InfoModal} />
      <Route path="expo/:doodleId" component={Expo} />
    </Route>

    <Route path="time-travel" getComponent={importTimeTravelLayout}>
      <Route path="info/:doodleId" component={InfoModal} />
      <Route path="expo/:doodleId" component={Expo} />
    </Route>
  </Router>
);

export default router;

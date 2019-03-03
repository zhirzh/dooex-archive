import React from 'react';
import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

import { App } from 'components';

function AppWithRouter() {
  return (
    <Router>
      <Route component={App} />
    </Router>
  );
}

export default AppWithRouter;

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
  Router,
  browserHistory,
} from 'react-router';

import store from 'store';
import {
  basename,
  routesWithBasename,
} from 'routes';

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routesWithBasename(basename)}
    </Router>
  </Provider>,
  document.getElementById('react'),
);

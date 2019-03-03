import React from 'react';
import {
  Route,
  IndexRoute,
} from 'react-router';

import {
  About,
  Home,
} from 'containers';

import {
  App,
  Error404,
} from 'components';

function routesWithBasename(basename) {
  return (
    <Route path={basename} component={App}>
      <IndexRoute component={Home} />
      <Route path={`${basename}/about`} component={About} />

      <Route path="*" component={Error404} />
    </Route>
  );
}

/*
  change `basename` to a pathname (window.location.pathname) that points to the webapp
*/
let basename;

try {
  basename = window.location.pathname;
} catch (_) {
  basename = '';
}

export {
  basename,
  routesWithBasename,
};

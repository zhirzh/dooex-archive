import React from 'react';
import reactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import {
  Router,
  createMemoryHistory,
} from 'react-router';

import store from 'store';
import { routesWithBasename } from 'routes';

const fs = require('fs');

const indexHTML = fs.readFileSync('src/index.html', 'utf-8')
  .replace(
    '<div id="app-shell"></div>',
    reactDOMServer.renderToString(
      <Provider store={store}>
        <Router history={createMemoryHistory()}>
          {routesWithBasename('/')}
        </Router>
      </Provider>,
    ),
  )
  .replace(/\n\s*/g, '');

const swJS = fs.readFileSync('dist/sw.js', 'utf-8')
  .replace(
    '{{VERSION}}',
    +new Date(),
  );

fs.writeFileSync('dist/index.html', indexHTML);
fs.writeFileSync('dist/sw.js', swJS);

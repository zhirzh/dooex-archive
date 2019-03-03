import fs from 'fs';
import path from 'path';

import db from '~/../data/db';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { matchPath, StaticRouter } from 'react-router';

import { BUILD_DIR } from '@/paths';

import App from '~/../client/lib/App';
import createStore from '~/../client/lib/modules/store';

const routes = [
  '/index.html',

  '/',
  '/fullscreen/:doodleId',
  '/info/:doodleId',

  '/saved',
  '/saved/fullscreen/:doodleId',
  '/saved/info/:doodleId',

  '/search',
  '/search/fullscreen/:doodleId',
  '/search/info/:doodleId',
];

async function router(req, resp, next) {
  const match = routes.find(route =>
    matchPath(req.path, {
      path: route,
      exact: true,
    }),
  );

  // bail
  if (!match) {
    return next();
  }

  const { Doodle } = db;
  const doodles = await Doodle.find().limit(5);
  const state = {
    doodles,
  };

  const store = createStore(state);

  const context = {};

  const reactApp = renderToString(
    <Provider store={store}>
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    </Provider>,
  );

  const html = fs
    .readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8')
    .replace('__APP__', reactApp)
    .replace('__STATE__', JSON.stringify(state).replace(/</g, '\\u003c'));

  return resp.send(html);
}

export default router;

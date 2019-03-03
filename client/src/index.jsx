// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Router from 'react-router/Router';
import Route from 'react-router/Route';

import { AppContainer } from 'react-hot-loader';

import App from './App';

import history from 'modules/history';
import createStore from 'modules/store';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(window.__DOOEX_STATE__);
delete window.__DOOEX_STATE__;

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Router history={history}>
          <Route component={Component} />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
}

render(App);
registerServiceWorker();

if (module.hot) {
  // $FlowFixMe
  module.hot.accept('./App', () => {
    const nextApp = require('./App').default;

    render(nextApp);
  });
}

if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');

  // whyDidYouUpdate(React, {
  //   include: /^Doodle$/,
  //   // exclude: /^.*$/,
  // });
}

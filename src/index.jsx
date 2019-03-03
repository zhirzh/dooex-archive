import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {AppContainer} from 'react-hot-loader';

import store from 'store';

import AppWithRouter from 'AppWithRouter.jsx';

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <AppWithRouter />
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('AppWithRouter', () => {
      const NextAppWithRouter = require('AppWithRouter').default;

      ReactDOM.render(
        <AppContainer>
          <Provider store={store}>
            <NextAppWithRouter />
          </Provider>
        </AppContainer>,
        document.getElementById('root')
      );
    });
  }
}

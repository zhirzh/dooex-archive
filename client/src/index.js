import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import store from 'modules/store';

import router from './router';

import registerServiceWorker from './registerServiceWorker';

import './index.scss';

function render(component) {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        {component}
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
}

render(router);

registerServiceWorker();

if (process.env.NODE_ENV === 'development') {
  /*eslint-disable*/

  if (module.hot) {
    module.hot.accept('./router.js', () => {
      const NextRootContainer = require('./router').default;
      render(NextRootContainer);
    });
  }

  // const { whyDidYouUpdate } = require('why-did-you-update');
  // whyDidYouUpdate(React, {
  //   exclude: [
  //     // 'DoodlesContainer',
  //   ],
  // });

  // const _componentDidUpdate = React.Component.prototype.componentDidUpdate || (() => {});
  // React.Component.prototype.componentDidUpdate = function() {
  //   const name = this.displayName || this.constructor.displayName || this.constructor.name;
  //   console.log('%c* ' + name, 'color: blue');

  //   _componentDidUpdate.apply(this, arguments);
  // };

  // const _componentWillMount = React.Component.prototype.componentWillMount || (() => {});
  // React.Component.prototype.componentWillMount = function() {
  //   const name = this.displayName || this.constructor.displayName || this.constructor.name;
  //   console.log('%c+ ' + name, 'color: green');

  //   _componentWillMount.apply(this, arguments);
  // };

  // const _componentWillUnmount = React.Component.prototype.componentWillUnmount || (() => {});
  // React.Component.prototype.componentWillUnmount = function() {
  //   const name = this.displayName || this.constructor.displayName || this.constructor.name;
  //   console.log('%c- ' + name, 'color: red');

  //   _componentWillUnmount.apply(this, arguments);
  // };
}

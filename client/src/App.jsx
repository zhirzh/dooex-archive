// @flow

import React from 'react';
import Route from 'react-router/Route';
import Switch from 'react-router/Switch';

import HomePage from 'pages/Home';
import SavedPage from 'pages/Saved';
import SearchPage from 'pages/Search';

function App() {
  return (
    <div>
      <Switch>
        <Route path="/saved" component={SavedPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </div>
  );
}

export default App;

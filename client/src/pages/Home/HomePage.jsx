// @flow

import React from 'react';

import NavBar from 'components/NavBar';
import MainPage from 'pages/Main';

function HomePage() {
  return (
    <div>
      <NavBar />
      <MainPage basepath="/" />
    </div>
  );
}

export default HomePage;

// @flow

import React from 'react';

import NavBar from 'components/NavBar';
import MainPage from 'pages/Main';

function SavedPage() {
  return (
    <div>
      <NavBar />
      <MainPage basepath="/saved" />
    </div>
  );
}

export default SavedPage;

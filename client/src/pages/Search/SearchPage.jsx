// @flow

import React from 'react';

import SearchBar from 'components/SearchBar';
import MainPage from 'pages/Main';

function SearchPage() {
  return (
    <div>
      <SearchBar />
      <MainPage basepath="/search" />
    </div>
  );
}

export default SearchPage;

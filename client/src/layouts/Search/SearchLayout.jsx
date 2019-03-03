import React from 'react';

import Main from 'components/Main';
import Hint from 'components/Hint';

import SearchBar from './components/SearchBar';

import './SearchLayout.scss';

class SearchLayout extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />

        <Hint hint="Search something">
          <Main />
        </Hint>

        {this.props.children}
      </div>
    );
  }
}

export default SearchLayout;

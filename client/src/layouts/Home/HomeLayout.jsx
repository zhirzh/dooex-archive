import React from 'react';

import Main from 'components/Main';
import TopBar from 'components/TopBar';

import './HomeLayout.scss';

class HomeLayout extends React.Component {
  render() {
    return (
      <div>
        <TopBar />

        <Main />

        {this.props.children}
      </div>
    );
  }
}

export default HomeLayout;

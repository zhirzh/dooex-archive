import React from 'react';

import Hint from 'components/Hint';
import TopBar from 'components/TopBar';

import Main from './components/Main';

import './TimeTravelLayout.scss';

class TimeTravelLayout extends React.Component {
  render() {
    return (
      <div>
        <TopBar />

        <Hint className="glyphicon" hint="Shake Phone">
          <Main />
        </Hint>

        {this.props.children}
      </div>
    );
  }
}

export default TimeTravelLayout;

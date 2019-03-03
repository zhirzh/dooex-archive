import React from 'react';

import Main from 'components/Main';
import TopBar from 'components/TopBar';
import Hint from 'components/Hint';

import './SavedLayout.scss';

class SavedLayout extends React.Component {
  render() {
    return (
      <div>
        <TopBar />

        <Hint hint="No saved doodles">
          <Main />
        </Hint>

        {this.props.children}
      </div>
    );
  }
}

export default SavedLayout;

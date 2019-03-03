import React from 'react';

import styles from './SaveButton.scss';

class SaveButton extends React.Component {
  render() {
    const className = this.props.isSaved ? styles.saved : styles.notSaved;

    return (
      <button onClick={this.props.onClick}>
        <span className={className} />
      </button>
    );
  }
}

export default SaveButton;

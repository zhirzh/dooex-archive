import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Iframe from './components/Iframe';

import styles from './Expo.scss';

class Expo extends React.Component {
  close = () => {
    if (this.props.isModal) {
      this.props.router.goBack();
      return;
    }

    this.props.router.push({
      ...this.props.location,
      pathname: this.props.location.pathname.replace(/expo\/.*$/, ''),
    });
  };

  renderDoodle() {
    if (this.props.doodle.type === 'interactive') {
      return <Iframe doodle={this.props.doodle} />;
    }

    const aspect = window.screen.width / window.screen.height;
    const className = aspect > this.props.doodle.aspect ? styles.landscape : styles.portrait;

    return (
      <img
        className={className}
        src={this.props.doodle.isSaved ? `/saved?${this.props.doodle.url}` : this.props.doodle.url}
        alt={this.props.doodle.title}
      />
    );
  }

  render() {
    if (this.props.doodle === undefined) {
      return null;
    }

    return (
      <div className={styles.screen}>
        <div className={styles.content}>
          {this.renderDoodle()}
        </div>

        <div className={styles.closeContainer}>
          <button className={styles.close} onClick={this.close}>
            &times;
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const doodleId = ownProps.params.doodleId;

  return {
    doodle: state.doodles.find(doodle => doodle.id === doodleId),
  };
}

export default withRouter(connect(mapStateToProps)(Expo));

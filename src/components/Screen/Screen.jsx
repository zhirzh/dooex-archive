import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styles from './Screen.css';

class Screen extends React.Component {
  static propTypes = {
    doodle: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isModal: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
  };

  close = () => {
    if (this.props.isModal) {
      this.props.history.goBack();
      return;
    }

    this.props.history.push({
      ...this.props.location,
      pathname: this.props.location.pathname.replace(/screen\/.*$/, ''),
    });
  };

  renderDoodle() {
    if (this.props.doodle.type === 'interactive') {
      return (
        <iframe
          id={styles.iframe}
          src={this.props.doodle.standalone_html}
          title={this.props.doodle.title}
        />
      );
    }

    const aspect = window.screen.width / window.screen.height;
    const className = aspect > this.props.doodle.aspect  ? styles.landscape : styles.portrait;

    return (
      <img
        id={styles.img}
        className={className}
        src={this.props.doodle.isSaved ? `./saved/?url=${this.props.doodle.url}` : this.props.doodle.url}
        alt={this.props.doodle.title}
      />
    );
  }

  render() {
    return (
      <div id={styles.screen}>
        <div id={styles.content}>
          {this.renderDoodle()}
        </div>

        <div id={styles.closeContainer} className="text-xs-right">
          <button className={styles.close} onClick={this.close}>&times;</button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const doodleId = ownProps.match.params.doodleId;

  return {
    doodle: state.doodles.find(doodle => doodle.id === doodleId),
  };
}

export default connect(mapStateToProps)(Screen);

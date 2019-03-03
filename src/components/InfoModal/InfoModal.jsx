import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { InfoTable } from 'components';

import styles from './InfoModal.css';

class InfoModal extends React.Component {
  static propTypes = {
    doodle: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isModal: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
  };

  backdrop = null;

  close = () => {
    if (this.props.isModal) {
      this.props.history.goBack();
      return;
    }

    this.props.history.push({
      ...this.props.location,
      pathname: this.props.location.pathname.replace(/info\/.*$/, ''),
    });
  };

  render() {
    if (this.props.doodle === undefined) {
      return null;
    }

    return (
      <div
        className={styles.root}
        ref={div => (this.modal = div)}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                className="close"
                onClick={this.close}
                aria-label="close modal"
              >
                &times;
              </button>

              <h4 className="modal-title">
                <a
                  href={`https://www.google.com/doodles/${this.props.doodle.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {this.props.doodle.title}
                  {' '}
                  <span className="glyphicon glyphicon-new-window" />
                </a>
              </h4>
            </div>

            <div className={styles.body}>
              <InfoTable data={this.props.doodle} keys={['countries', 'tags']} />
            </div>
          </div>
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

export default connect(mapStateToProps)(InfoModal);

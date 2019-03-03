import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { SaveButton } from 'components';

import styles from './DoodleCard.css';

async function saveCacheDoodle(doodle) {
  const resp = await fetch(doodle.url, { mode: 'no-cors' });
  const cache = await caches.open('DOOEX-save');

  return cache.put(doodle.url, resp);
}

async function unsaveCacheDoodle(doodle) {
  const cache = await caches.open('DOOEX-save');

  return cache.delete(doodle.url);
}

function hideBrokenTile(e) {
  e.currentTarget.classList.add(styles.brokenTile);
}

class DoodleCard extends React.Component {
  static propTypes = {
    doodle: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  state = {
    isTarget: false,
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  setTarget = () => this.setState({ isTarget: true });
  unsetTarget = () => this.setState({ isTarget: false });

  toggleSave = async () => {
    try {
      if (this.props.doodle.isSaved) {
        await unsaveCacheDoodle(this.props.doodle);
      } else {
        await saveCacheDoodle(this.props.doodle);
        this.unsetTarget();
      }
    } catch (err) {
      console.error(err);
      alert(`${this.props.doodle.isSaved ? 'UNSAVE' : 'SAVE'} FAILED`);

      return;
    }

    this.props.toggleSave(this.props.doodle);
  };

  updateDimensions = () => {
    const w = this.link.clientWidth;
    const a = 1 / this.props.doodle.aspect;

    this.link.style.height = `${w * a}px`;
  };

  modalPathname(modalType) {
    return {
      ...this.props.location,
      pathname: `/${modalType}/${this.props.doodle.id}`,
      state: { modal: true },
    };
  }

  render() {
    return (
      <div
        className={styles.root}
        tabIndex="0"
        aria-label={`doodle - ${this.props.doodle.title}`}
      >
        <div className={styles.heading}>
          <div className="pull-left">
            <h3
              className={styles.title}
              aria-label={`doodle title - ${this.props.doodle.title}`}
              tabIndex="0"
            >
              {this.props.doodle.title}
            </h3>

            <Link
              to={this.modalPathname('info')}
              title="info on doodle"
              style={{
                marginLeft: 5,
                paddingTop: 6,
                display: 'inline-block',
              }}
            >
              <span className="glyphicon glyphicon-info-sign" />
            </Link>
          </div>

          <SaveButton
            isSaved={this.props.doodle.isSaved}
            isTarget={this.state.isTarget}

            onClick={this.toggleSave}

            onFocus={this.setTarget}
            onBlur={this.unsetTarget}

            onMouseEnter={this.setTarget}
            onMouseLeave={this.unsetTarget}
          />
          <div className="clearfix" />
        </div>

        <div ref={link => (this.link = link)}>
          <Link to={this.modalPathname('screen')}>
            <img
              className={styles.tile}
              src={this.props.doodle.url}
              alt={this.props.doodle.title}
              onError={hideBrokenTile}
            />
          </Link>
        </div>
      </div>
    );
  }
}

export default DoodleCard;

import React from 'react';

import { connect } from 'react-redux';

import { resetDistance, updateDistance } from 'modules/time-travel/reducer';

import Main from 'components/Main';

import styles from './Main.scss';

class TimeTravelMain extends React.Component {
  amplitudeThreshold = 10;
  isShakingEnabled = true;
  timeoutId = -1;

  amplitudeDistance = 0;
  durationDistance = 0;
  jumpDistance = 0;

  state = {
    mode: 'amplitude',
  };

  componentDidMount() {
    window.addEventListener('devicemotion', this.handleMotion);
  }

  componentWillUnmount() {
    window.removeEventListener('devicemotion', this.handleMotion);
  }

  reset = () => {
    this.amplitudeDistance = 0;
    this.durationDistance = 0;
  };

  resetTimeout() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(this.reset, 1000);
  }

  getAmplitudeDistance(amplitude) {
    this.resetTimeout();

    this.amplitudeDistance += Math.floor(amplitude);
    return this.amplitudeDistance;
  }

  getDurationDistance() {
    this.resetTimeout();

    this.durationDistance += 1;
    return this.durationDistance;
  }

  getJumpDistance() {
    this.resetTimeout();

    this.jumpDistance = Math.floor(Math.random() * this.props.doodles.length);
    return this.jumpDistance;
  }

  handleMotion = (e) => {
    if (this.isShakingEnabled === false) {
      return;
    }

    const { x, y, z } = e.acceleration;
    const amplitude = Math.sqrt(x * x + y * y + z * z) - this.amplitudeThreshold;

    if (amplitude < 0) {
      return;
    }

    let distance;
    switch (this.state.mode) {
      case 'amplitude':
        distance = this.getAmplitudeDistance(amplitude);
        break;

      case 'duration':
        distance = this.getDurationDistance();
        break;

      case 'jump':
        distance = this.getJumpDistance();
        break;

      default:
        throw Error();
    }

    this.props.updateDistance(distance);
  };

  updateMode = (e) => {
    this.setState({ mode: e.currentTarget.value });
  };

  render() {
    return (
      <div>
        <div className={styles.options}>
          <div className="btn-group">
            <button
              onClick={this.updateMode}
              value="amplitude"
              className={
                this.state.mode === 'amplitude' ? styles.radioButtonActive : styles.radioButton
              }
            >
              Amplitude
            </button>

            <button
              onClick={this.updateMode}
              value="duration"
              className={
                this.state.mode === 'duration' ? styles.radioButtonActive : styles.radioButton
              }
            >
              Duration
            </button>

            <button
              onClick={this.updateMode}
              value="jump"
              className={this.state.mode === 'jump' ? styles.radioButtonActive : styles.radioButton}
            >
              Jump
            </button>
          </div>
        </div>

        <Main />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    doodles: state.doodles,
  };
}

const mapDispatchToProps = {
  resetDistance,
  updateDistance,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeTravelMain);

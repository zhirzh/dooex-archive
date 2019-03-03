// @flow

import React, { Component } from 'react';

import Loader from './Loader';

import styles from './Tile.css';

type Props = {
  src: string,
  title: string,
};

type State = {
  ready: boolean,
};

class Tile extends Component<Props, State> {
  static maxRetries = 5;

  state = {
    ready: false,
  };

  componentDidMount() {
    const img = new Image();
    img.src = this.props.src;

    img.onload = this.handleLoad;
    img.onerror = this.handleError;
  }

  handleError = (e: Event) => {
    // bail
    if (navigator.onLine === false) {
      return;
    }

    if (this.retries > Tile.maxRetries) {
      return;
    }

    // $FlowFixMe
    const img = e.path[0];

    // $FlowFixMe
    img.src = `${this.props.src}?${+new Date()}`;

    this.retries += 1;
  };

  handleLoad = () => {
    this.setState({ ready: true });
  };

  refImg = null;

  retries = 0;

  render() {
    if (this.state.ready === false) {
      return <Loader />;
    }

    return (
      <img
        className={styles.root}
        src={this.props.src}
        alt={this.props.title}
        ref={img => (this.refImg = img)}
      />
    );
  }
}

export default Tile;

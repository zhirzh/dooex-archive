// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import withRouter from 'react-router/withRouter';

import styles from './NoDoodles.css';

type Props = {
  shouldRender: boolean,
};

class NoDoodles extends Component<Props> {
  faces = [
    '(-_-)',
    '(._.)',
    '(· ·)',
    '(·_·)',
    '(·.·)',
    '(˚Δ˚)',
    '(°_°)',
    '(°.°)',
    '(°o°)',
    '(>_<)',
    '(~_~)',
    '(o_o)',
    '(T_T)',
  ];

  faceIdx = this.randomFaceIdx();

  randomFaceIdx() {
    return Math.floor(Math.random() * this.faces.length);
  }

  render() {
    if (this.props.shouldRender === false) {
      this.faceIdx = this.randomFaceIdx();

      return null;
    }

    return (
      <div className={styles.root}>
        <h1>{this.faces[this.faceIdx]}</h1>

        <small>No doodles to see</small>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { search: searchKeyword } = state;
  const { pathname } = ownProps.location;
  const { doodlesCount } = ownProps;

  let shouldRender = false;

  if (pathname.startsWith('/search') && searchKeyword.length > 0 && doodlesCount === 0) {
    shouldRender = true;
  }

  if (pathname.startsWith('/saved') && doodlesCount === 0) {
    shouldRender = true;
  }

  return {
    shouldRender,
  };
}

export default withRouter(connect(mapStateToProps)(NoDoodles));

// @flow

import type { Location, RouterHistory } from 'react-router';

import type { Doodle } from 'modules/types';

import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
  doodle: Doodle,
  history: RouterHistory,
  isModal: boolean,
  location: Location,
};

class Modal extends Component<Props> {
  static defaultProps = {
    doodle: null,
  };

  close = (modalType) => {
    if (this.props.isModal) {
      this.props.history.goBack();

      return;
    }

    const pathnameRegexp = new RegExp(`${modalType}/.*$`);
    const pathname = this.props.location.pathname.replace(pathnameRegexp, '');

    this.props.history.push({
      ...this.props.location,
      pathname,
    });
  };

  render() {
    const { doodle } = this.props;

    if (doodle === null) {
      return null;
    }

    return React.cloneElement(this.props.children, {
      close: this.close,
      doodle: this.props.doodle,
    });
  }
}

function mapStateToProps(state, ownProps) {
  const { doodleId } = ownProps.match.params;

  const isModal = !!(ownProps.location.state && ownProps.location.state.isModal);

  return {
    doodle: state.doodles.find(doodle => doodle.id === doodleId),
    isModal,
  };
}

export default connect(mapStateToProps)(Modal);

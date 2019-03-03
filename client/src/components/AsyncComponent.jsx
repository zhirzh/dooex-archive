// @flow

import React, { Component } from 'react';

type Props = {
  load: Promise<*>,
  props: Object,
};

type State = {
  comp: *,
};

class AsyncComponent extends Component<Props, State> {
  static defaultProps = {
    props: {},
  };

  state = {
    comp: null,
  };

  componentWillMount() {
    this.loadComponent(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.load !== this.props.load) {
      this.loadComponent(nextProps);
    }
  }

  loadComponent(props: Props) {
    this.setState({ comp: null });

    props.load.then((mod) => {
      this.setState({ comp: mod.default });
    });
  }

  render() {
    if (this.state.comp === null) {
      return null;
    }

    const compProps = this.props.props;

    return <this.state.comp {...compProps} />;
  }
}

export default AsyncComponent;

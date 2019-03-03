// @flow

import type { Location } from 'react-router';

import type { Doodle as DoodleType } from 'modules/types';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import withRouter from 'react-router/withRouter';

import Doodle from './Doodle';
import NoDoodles from './NoDoodles';

import savedFilter from 'filters/saved-filter';
import searchFilter from 'filters/search-filter';
import detectPassive from 'modules/detect-passive';
import { loadDoodles } from 'reducers/doodles';
import { loadNextDoodles } from 'reducers/infinite-scroll';

import styles from './Main.css';

type Props = {
  doodles: Array<DoodleType>,
  loadDoodles: Function,
  location: Location,
  pathname: string,
  loadNextDoodles: Function,
};

const isPassive = detectPassive();

class Main extends Component<Props> {
  componentDidMount() {
    if (this.props.doodles.length <= 5) {
      // window.__DOOEX_DOODLES__
      this.props.loadDoodles();
    }

    window.addEventListener('scroll', this.handleScroll, isPassive && { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    // $FlowFixMe
    const { scrollingElement } = document;

    const scrolledRatio =
      scrollingElement.scrollTop / (scrollingElement.scrollHeight - window.innerHeight);

    if (scrolledRatio > 0.9) {
      this.loadNextDoodles();
    }
  };

  loadNextDoodles = () => {
    if (this.shouldLoadNextDoodles === false) {
      return;
    }

    // throttle scrolling
    this.shouldLoadNextDoodles = false;
    setTimeout(() => {
      this.shouldLoadNextDoodles = true;
    }, 600);

    this.props.loadNextDoodles();
  };

  shouldLoadNextDoodles = true;

  renderDoodles() {
    if (this.props.doodles.length === 0) {
      return null;
    }

    const basepath = this.props.location.pathname.replace(/\/$/, '');

    return (
      <div>
        {this.props.doodles.map(doodle => (
          <Doodle
            key={doodle.id}
            doodle={doodle}
            basepath={basepath}
            toggleSave={this.toggleSave}
          />
        ))}

        <hr style={{ width: '85%' }} />
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <div className={styles.row}>
          <div className={styles.content}>
            <NoDoodles doodlesCount={this.props.doodles.length} />

            {this.renderDoodles()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps: Props) {
  const { infiniteScrollBatchSize: batchSize, search: searchKeyword } = state;
  let { doodles } = state;

  const { pathname } = ownProps.location;

  switch (true) {
    case pathname.startsWith('/search'):
      doodles = searchFilter(doodles, searchKeyword);
      break;

    case pathname.startsWith('/saved'):
      doodles = savedFilter(doodles);
      break;

    default:
  }

  doodles = doodles.slice(0, batchSize);

  return {
    doodles,
  };
}

const mapDispatchToProps = {
  loadDoodles,
  loadNextDoodles,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import detectMobileBrowser from 'detect-mobile-browser';

import { getDoodlesSlice } from 'modules/doodles/reducer';

import {
  DoodleCardsContainer,
  FilterTabsContainer,
  MobileFilterButton,
  SideMenu,
} from 'components';

import styles from './Home.css';

const isMobileBrowser = detectMobileBrowser();

let prevTouchPos = 0;
function updateTourchPos(e) {
  prevTouchPos = e.touches[0].clientY;
}

class Home extends React.Component {
  static propTypes = {
    isModal: PropTypes.bool.isRequired,

    getDoodlesSlice: PropTypes.func.isRequired,
  };

  state = {
    isFilterVisible: !isMobileBrowser, // default value
    isMobileFilterButtonVisible: isMobileBrowser, // default value
    shouldLoadNext: true,
    foo: 0,
  };

  ref = null;
  prevScrollTop = 0;

  componentDidMount() {
    this.props.getDoodlesSlice();

    this.ref.addEventListener('scroll', () => {
      if (this.ref.scrollTop === 0) {
        return;
      }

      this.prevScrollTop = this.ref.scrollTop;
    });
  }

  loadNext = (e) => {
    if (this.state.shouldLoadNext === false) {
      return;
    }

    const scrolledRatio = e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.offsetHeight);

    if (scrolledRatio < 0.9) {
      return;
    }

    this.setState(
      {
        foo: this.state.foo + 1,
        shouldLoadNext: false,
      },
      // debouncing to prevent rapid event firing
      () => setTimeout(() => this.setState({ shouldLoadNext: true }), 1000)
    );
  };

  toggleFilter = () => {
    this.setState({ isFilterVisible: !this.state.isFilterVisible });
  };

  toggleMobileFilterButton = (e) => {
    if (this.state.isFilterVisible) {
      return;
    }

    const delta = e.touches[0].clientY - prevTouchPos;
    this.setState({ isMobileFilterButtonVisible: delta > 0 });

    updateTourchPos(e);
  };

  render() {
    let contentClassName;
    if (isMobileBrowser) {
      contentClassName = 'col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2';
    } else {
      contentClassName = 'col-xs-8 col-xs-offset-4 col-sm-9 col-sm-offset-3 col-md-6 col-md-offset-4';
    }

    const shouldPreventScroll = (isMobileBrowser && this.state.isFilterVisible) || this.props.isModal;

    if (this.ref) {
      if (isMobileBrowser && this.state.isFilterVisible) {
        this.ref.scrollTop = 0;
      } else {
        this.ref.scrollTop = this.prevScrollTop;
      }
    }

    return (
      <div
        onTouchStart={updateTourchPos}
        onTouchMove={this.toggleMobileFilterButton}
        className={shouldPreventScroll ? styles.rootNoScroll : styles.root}
        onScroll={this.loadNext}
        ref={div => this.ref = div}
      >
        <SideMenu isVisible={this.state.isFilterVisible} />

        <div className={contentClassName}>
          <FilterTabsContainer />

          <DoodleCardsContainer foo={this.state.foo} />
        </div>

        <MobileFilterButton
          onClick={this.toggleFilter}
          isFilterVisible={this.state.isFilterVisible}
          isVisible={this.state.isMobileFilterButtonVisible}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  getDoodlesSlice,
};

export default connect(null, mapDispatchToProps)(Home);

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Doodles,
  SideBar
} from 'containers';

import {
  TopBar,
  Screen,
} from 'components';

import { getDoodles } from 'modules/doodles';

import styles from 'styles/reset.scss';

class Home extends Component {
  constructor() {
    super();

    this.state = {
      screenDoodle: null,
      isScreenHidden: true,

      isMobileMenuHidden: true,
    };

    this.hideScreen = this.hideScreen.bind(this);
    this.renderDoodleToScreen = this.renderDoodleToScreen.bind(this);

    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
  }

  componentDidMount() {
    this.props.getDoodles();
  }

  toggleMobileMenu() {
    if (this.state.isMobileMenuHidden) {
      document.body.classList.add(styles.noscroll);
    } else {
      document.body.classList.remove(styles.noscroll);
    }

    this.setState({ isMobileMenuHidden: !this.state.isMobileMenuHidden });
  }

  hideScreen() {
    document.body.classList.remove(styles.noscroll);

    this.setState({
      screenDoodle: null,
      isScreenHidden: true,
    });
  }

  renderDoodleToScreen(doodle) {
    document.body.classList.add(styles.noscroll);

    this.setState({
      screenDoodle: doodle,
      isScreenHidden: false,
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <TopBar
            isMobileMenuHidden={this.state.isMobileMenuHidden}

            toggleMobileMenu={this.toggleMobileMenu}
          />

          <SideBar
            className="col-lg-2 col-sm-3 col-xs-12 bg-faded"
            isMobileMenuHidden={this.state.isMobileMenuHidden}
          />

          <Doodles
            className="col-lg-10 col-sm-9"

            renderToScreen={this.renderDoodleToScreen}
          />
        </div>

        <Screen
          isHidden={this.state.isScreenHidden}
          doodle={this.state.screenDoodle}

          hideScreen={this.hideScreen}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  getDoodles,
};

export default connect(null, mapDispatchToProps)(Home);

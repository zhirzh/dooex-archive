import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectDoodles from 'modules/doodles/selector';
import { getAllDoodles } from 'modules/doodles/reducer';

import { Screen } from 'components';

class ScreenContainer extends React.Component {
  static propTypes = {
    allDoodlesCount: PropTypes.number.isRequired,

    getAllDoodles: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getAllDoodles();
  }

  render() {
    if (this.props.allDoodlesCount === 0) {
      return null;
    }

    return (
      <Screen {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const allDoodles = selectDoodles(state.doodles, state.filters);

  return {
    allDoodlesCount: allDoodles.length,
  };
}

const mapDispatchToProps = {
  getAllDoodles,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenContainer);

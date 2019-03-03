import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import selectDoodles from 'modules/doodles/selector';
import { updateDoodle } from 'modules/doodles/reducer';

import { DoodleCard } from 'components';

import styles from './DoodleCardsContainer.css';

class DoodleCardsContainer extends React.Component {
  static propTypes = {
    allDoodles: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,

    updateDoodle: PropTypes.func.isRequired,
  };

  state = {
    stepSize: -10,
  };

  toggleSave = (doodle) => {
    this.props.updateDoodle({
      ...doodle,
      isSaved: !doodle.isSaved,
    });
  };

  render() {
    const sliceSize = this.state.stepSize * (1 + this.props.foo);
    const doodles = this.props.allDoodles.slice(sliceSize).reverse();

    return (
      <div className={this.props.filtersCount > 0 ? styles.root : styles.rootFoo}>
        {doodles.map(doodle => (
          <DoodleCard
            key={doodle.id}
            doodle={doodle}
            location={this.props.location}
            toggleSave={this.toggleSave}
          />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allDoodles: selectDoodles(state.doodles, state.filters),
    filtersCount: state.filters.length,
  };
}

const mapDispatchToProps = {
  updateDoodle,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoodleCardsContainer));

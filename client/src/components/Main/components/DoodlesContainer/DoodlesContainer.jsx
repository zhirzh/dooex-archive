import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import filterSelector from 'modules/doodles/filterSelector';
import searchSelector from 'modules/doodles/searchSelector';
import savedSelector from 'modules/doodles/savedSelector';
import dateSelector from 'modules/doodles/dateSelector';
import timeTravelSelector from 'modules/doodles/timeTravelSelector';

import { updateDoodle } from 'modules/doodles/reducer';

import Doodle from './components/Doodle';

import styles from './DoodlesContainer.scss';

function compareDoodles(x, y) {
  if (x.length !== y.length) {
    return false;
  }

  for (let i = 0; i < x.length; i += 1) {
    const xx = x[i];
    const yy = y[i];

    if (xx.id !== yy.id) {
      return false;
    }
  }

  return true;
}

class DoodlesContainer extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return !(compareDoodles(nextProps.allDoodles, this.props.allDoodles));
  // }

  toggleSave = (doodle) => {
    this.props.updateDoodle({
      ...doodle,
      isSaved: !doodle.isSaved,
    });
  };

  render() {
    return (
      <div className={styles.root}>
        {this.props.allDoodles.map(doodle =>
          (<Doodle
            key={doodle.id}
            doodle={doodle}
            location={this.props.location}
            toggleSave={this.toggleSave}
          />),
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  let allDoodles = state.doodles;

  const allFilters = state.filters;
  const searchKeyword = state.search;
  const { from: dateFrom, to: dateTo } = state.date;
  const distance = state.timeTravel;

  const batchStart = ownProps.batchStart;
  const batchSize = ownProps.batchSize;

  const pathname = ownProps.location.pathname;

  switch (pathname) {
    case '/search':
      allDoodles = searchSelector(allDoodles, searchKeyword);
      break;

    case '/time-travel':
      allDoodles = timeTravelSelector(allDoodles, distance);
      break;

    case '/saved':
      allDoodles = savedSelector(allDoodles);
      break;

    default:
      break;
  }

  allDoodles = filterSelector(allDoodles, allFilters);
  allDoodles = dateSelector(allDoodles, dateFrom, dateTo);

  return {
    allDoodles: allDoodles.slice(batchStart, batchStart + batchSize),
    filtersCount: allFilters.length,
  };
}

const mapDispatchToProps = {
  updateDoodle,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoodlesContainer));

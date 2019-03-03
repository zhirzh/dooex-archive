import React from 'react';
import { connect } from 'react-redux';

import { updateFrom, updateTo } from 'modules/date/reducer';

import styles from './DateFilter.scss';

function range(start, stop = null, step = 1) {
  if (stop === null) {
    stop = start;
    start = 0;
  }

  if (step > 0 && start >= stop) {
    return [];
  }

  if (step < 0 && start <= stop) {
    return [];
  }

  const ret = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    ret.push(i);
  }

  return ret;
}

class DateFilter extends React.Component {
  monthNames = [
    null,
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];
  monthLengths = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  handleChange = (e) => {
    const value = +e.currentTarget.value;

    let key;
    let slice;

    switch (e.currentTarget.id) {
      case 'from[day]':
        slice = 'from';
        key = 'day';
        break;

      case 'from[month]':
        slice = 'from';
        key = 'month';
        break;

      case 'from[year]':
        slice = 'from';
        key = 'year';
        break;

      case 'to[day]':
        slice = 'to';
        key = 'day';
        break;

      case 'to[month]':
        slice = 'to';
        key = 'month';
        break;

      case 'to[year]':
        slice = 'to';
        key = 'year';
        break;

      default:
        throw Error();
    }

    switch (slice) {
      case 'from': {
        const fromMin = Date.UTC(this.props.min.year, this.props.min.month, this.props.min.day);

        const _from = {
          ...this.props.from,
          [key]: value,
        };

        const fromCurr = Date.UTC(_from.year, _from.month, _from.day);

        if (fromCurr > fromMin) {
          this.props.updateFrom({ [key]: value });
        }

        break;
      }

      case 'to': {
        const toMax = Date.UTC(this.props.max.year, this.props.max.month, this.props.max.day);

        const _to = {
          ...this.props.to,
          [key]: value,
        };

        const toCurr = Date.UTC(_to.year, _to.month, _to.day);

        if (toCurr < toMax) {
          this.props.updateTo({ [key]: value });
        }

        break;
      }

      default:
        throw Error();
    }
  };

  render() {
    const fromMonthLength = this.monthLengths[this.props.from.month];
    const fromDays = range(fromMonthLength, 0, -1);

    const toMonthLength = this.monthLengths[this.props.to.month];
    const toDays = range(toMonthLength, 0, -1);

    const months = range(12, 0, -1);
    const years = range(this.props.max.year, this.props.min.year - 1, -1);

    return (
      <div className={styles.root}>
        <strong>From</strong>

        <div className={styles.dateBox}>
          <select
            id={'from[day]'}
            className={styles.select}
            value={this.props.from.day}
            onChange={this.handleChange}
          >
            {fromDays.map(day =>
              (<option key={day} value={day}>
                {day}
              </option>),
            )}
          </select>

          <select
            id={'from[month]'}
            className={styles.select}
            value={this.props.from.month}
            onChange={this.handleChange}
          >
            {months.map(month =>
              (<option key={month} value={month}>
                {this.monthNames[month]}
              </option>),
            )}
          </select>

          <select
            id={'from[year]'}
            className={styles.select}
            value={this.props.from.year}
            onChange={this.handleChange}
          >
            {years.map(year =>
              (<option key={year} value={year}>
                {year}
              </option>),
            )}
          </select>
        </div>

        <strong> To </strong>

        <div className={styles.dateBox}>
          <select
            id={'to[day]'}
            className={styles.select}
            value={this.props.to.day}
            onChange={this.handleChange}
          >
            {toDays.map(day =>
              (<option key={day} value={day}>
                {day}
              </option>),
            )}
          </select>

          <select
            id={'to[month]'}
            className={styles.select}
            value={this.props.to.month}
            onChange={this.handleChange}
          >
            {months.map(month =>
              (<option key={month} value={month}>
                {this.monthNames[month]}
              </option>),
            )}
          </select>

          <select
            id={'to[year]'}
            className={styles.select}
            value={this.props.to.year}
            onChange={this.handleChange}
          >
            {years.map(year =>
              (<option key={year} value={year}>
                {year}
              </option>),
            )}
          </select>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.date;
}

const mapDispatchToProps = {
  updateFrom,
  updateTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(DateFilter);

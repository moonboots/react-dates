import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import cx from 'classnames';

const propTypes = {
  day: momentPropTypes.momentObj,
  getDayModifications: PropTypes.func.isRequired,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onDayMouseLeave: PropTypes.func,
};

const defaultProps = {
  day: moment(),
  onDayClick() {},
  onDayMouseEnter() {},
  onDayMouseLeave() {},
};

export default class CalendarDay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modifications: {},
    };
  }

  componentWillReceiveProps({ day, getDayModifications }) {
    this.setState({
      modifications: getDayModifications(day),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState) ||
      shallowCompare(
        this.state.modifications,
        nextProps.getDayModifications(nextProps.day)
      );
  }

  onDayClick(day, e) {
    const { onDayClick } = this.props;
    onDayClick(day, e);
  }

  onDayMouseEnter(day, e) {
    const { onDayMouseEnter } = this.props;
    onDayMouseEnter(day, e);
  }

  onDayMouseLeave(day, e) {
    const { onDayMouseLeave } = this.props;
    onDayMouseLeave(day, e);
  }

  render() {
    const { day } = this.props;

    const modClassNames = Object
      .entries(this.state.modifications)
      .filter(([modName, isModApplied]) => isModApplied)
      .map(([modName, isModApplied]) => `CalendarMonth__day--${modName}`);

    return (
      <div
        className={cx("CalendarDay", modClassNames)}
        onMouseEnter={e => this.onDayMouseEnter(day, e)}
        onMouseLeave={e => this.onDayMouseLeave(day, e)}
        onClick={e => this.onDayClick(day, e)}
      >
        <span className="CalendarDay__day">{day.format('D')}</span>
      </div>
    );
  }
}

CalendarDay.propTypes = propTypes;
CalendarDay.defaultProps = defaultProps;

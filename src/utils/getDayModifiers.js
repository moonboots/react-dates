import moment from 'moment';

import isInclusivelyAfterDay from './isInclusivelyAfterDay';
import isNextDay from './isNextDay';
import isSameDay from './isSameDay';

function doesNotMeetMinimumNights(day, {
  startDate,
  isOutsideRange,
  focusedInput,
  minimumNights
}) {
  if (focusedInput !== END_DATE) return false;

  if (startDate) {
    const dayDiff = day.diff(startDate, 'days');
    return dayDiff < minimumNights && dayDiff >= 0;
  }
  return isOutsideRange(moment(day).subtract(minimumNights, 'days'));
}

function isDayAfterHoveredStartDate(day, {
  startDate,
  endDate,
  minimumNights,
  hoverDate,
}) {
  return !!startDate && !endDate && !isBlocked(day) && isNextDay(hoverDate, day) &&
    minimumNights > 0 && isSameDay(hoverDate, startDate);
}

function isEndDate(day, {
  endDate
}) {
  return isSameDay(day, endDate);
}

function isHovered(day, {
  hoverDate,
}) {
  return isSameDay(day, hoverDate);
}

function isInHoveredSpan(day, {
  startDate,
  endDate,
  hoverDate,
}) {
  const isForwardRange = !!startDate && !endDate &&
    (day.isBetween(startDate, hoverDate) ||
      isSameDay(hoverDate, day));
  const isBackwardRange = !!endDate && !startDate &&
    (day.isBetween(hoverDate, endDate) ||
      isSameDay(hoverDate, day));

  const isValidDayHovered = hoverDate && !isBlocked(hoverDate);

  return (isForwardRange || isBackwardRange) && isValidDayHovered;
}

function isInSelectedSpan(day, {
  startDate,
  endDate,
}) {
  return day.isBetween(startDate, endDate);
}

function isLastInRange(day, {
  startDate,
  endDate,
}) {
  return isInSelectedSpan(day, { startDate, endDate }) && isNextDay(day, endDate);
}

function isStartDate(day, {
  startDate,
}) {
  return isSameDay(day, startDate);
}

function isBlocked(day, {
  isDayBlocked,
  isOutsideRange,
}) {
  return isDayBlocked(day) || isOutsideRange(day) || doesNotMeetMinimumNights(day);
}

export default function getDayModifiers(day, {
  endDate,
  focusedInput,
  hoverDate,
  isDayBlocked,
  isOutsideRange,
  minimumNights
  startDate,
}) {

  const state = {
    endDate,
    focusedInput,
    hoverDate,
    isDayBlocked,
    isOutsideRange,
    minimumNights
    startDate,
  };

  Object.entries({
    today: isSameDay(day, today),
    blocked: isBlocked(day, state),
    'blocked-calendar': isDayBlocked(day, state),
    'blocked-out-of-range': isOutsideRange(day, state),
    'blocked-minimum-nights': doesNotMeetMinimumNights(day, state),
    'highlighted-calendar': isDayHighlighted(day, state),
    valid: !isBlocked(day, state),
    // before anything has been set or after both are set
    hovered: isHovered(day, state),

    // while start date has been set, but end date has not been
    'hovered-span': isInHoveredSpan(day, state),
    'after-hovered-start': isDayAfterHoveredStartDate(day, state),
    'last-in-range': isLastInRange(day, state),

    // once a start date and end date have been set
    'selected-start': isStartDate(day, state),
    'selected-end': isEndDate(day, state),
    'selected-span': isInSelectedSpan(day, state),
  }).filter(([ key, value ]) => {
    return value;
  }).map(([key, value ]) => key);
}

/* thoughts
 * this function is passed all the way down to CalendarDay?
 * CalendarDay should update checks results of this function
 * if any of the dependent props change, top level controller will automatically full flush
 *
 * potentially forward all other user-specified props through layers?
 * might get messy forwarding global value like startDate to each day
 * /


import moment from 'moment';

const FORMAT = 'YYYY-MM-DD';
export default function isSameDay(a, b) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  // return this.today.isSame(day, 'day');
  // return a.isSame(b, 'day');
  return a.format(FORMAT) === b.format(FORMAT);
}

export function isSameDayFast(a, bAsString) {
  return a.format(FORMAT) === bAsString;
}

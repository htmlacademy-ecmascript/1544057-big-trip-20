import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const humanizeDate = (date, dateformat) => date ? dayjs(date).format(dateformat) : '';

const calculateDuration = (start, stop) => {
  const eventTime = dayjs.duration(dayjs(stop) - dayjs(start), 'millisecond');

  if (eventTime.$d.days) {
    return eventTime.format('DD[d] HH[h] mm[M]');
  } else if (!eventTime.$d.days && eventTime.$d.hours) {
    return eventTime.format('HH[h] mm[M]');
  }
  return eventTime.format('mm[M]');

};

export { calculateDuration, humanizeDate };

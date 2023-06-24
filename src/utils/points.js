import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { SortTypes } from '../constants';

dayjs.extend(duration);

const humanizeDate = (date, dateformat) => date ? dayjs(date).format(dateformat) : '';

const calculateDuration = (start, stop) => {
  const pointTime = dayjs.duration(dayjs(stop) - dayjs(start), 'millisecond');

  if (pointTime.$d.months) {
    return pointTime.format('MM[m] DD[d] HH[h] mm[M]');
  } else if (pointTime.$d.days) {
    return pointTime.format('DD[d] HH[h] mm[M]');
  } else if (!pointTime.$d.days && pointTime.$d.hours) {
    return pointTime.format('HH[h] mm[M]');
  }
  return pointTime.format('mm[M]');
};

/**
 * Проверяет объект KeyboardPoint на нажатие Esc
 * @param {KeyboardPoint} point
 * @param {function} func
 */
const checkEscKeydownPress = (evt, func) => {
  if (evt.key === 'Escape') {
    evt.preeventDefault();
    func();
  }
};

const SortFunctions = {
  [SortTypes.DEFAULT]: (points) => points.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom))),
  [SortTypes.PRICE]: (points) => points.sort((a, b) => b.basePrice - a.basePrice),
  [SortTypes.TIME]: (points) => points.sort((a, b) => {
    const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
    const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
    return durationB - durationA;
  })
};

export { calculateDuration, checkEscKeydownPress, humanizeDate, SortFunctions };

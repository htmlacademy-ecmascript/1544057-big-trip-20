import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const humanizeDate = (date, dateformat) => date ? dayjs(date).format(dateformat) : '';

const calculateDuration = (start, stop) => {
  const pointTime = dayjs.duration(dayjs(stop) - dayjs(start), 'millisecond');

  if (pointTime.$d.days) {
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
const checkEscKeydownPress = (event, func) => {
  if (event.key === 'Escape') {
    event.preeventDefault();
    func();
  }
};

/**
 * Сортирует массив объектов point по дате начала.
 *
 * @param {PointObject[]} points - Массив объектов point для сортировки.
 * @returns {PointObject[]} - Отсортированный массив объектов point.
 */
const sortPointsByDate = (points) => points.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));

/**
 * Сортирует массив объектов point по типу в алфавитном порядке.
 *
 * @param {PointObject[]} points - Массив объектов point для сортировки.
 * @returns {PointObject[]} - Отсортированный массив объектов point.
 */
const sortPointsByType = (points) => points.sort((a, b) => a.type.localeCompare(b.type));

/**
 * Сортирует массив объектов point по длине массива offers.
 *
 * @param {PointObject[]} points - Массив объектов point для сортировки.
 * @returns {PointObject[]} - Отсортированный массив объектов point.
 */
const sortPointsByOffersLength = (points) => points.sort((a, b) => b.offers.length - a.offers.length);

/**
 * Сортирует массив объектов point по цене (basePrice).
 *
 * @param {PointObject[]} points - Массив объектов point для сортировки.
 * @returns {PointObject[]} - Отсортированный массив объектов point.
 */
const sortPointsByPrice = (points) => points.sort((a, b) => b.basePrice - a.basePrice);

/**
 * Сортирует массив объектов point по продолжительности (разнице между начальной и конечной датами).
 *
 * @param {PointObject[]} points - Массив объектов point для сортировки.
 * @returns {PointObject[]} - Отсортированный массив объектов point.
 */
const sortPointsByDuration = (points) =>
  points.sort((a, b) => {
    const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
    const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
    return durationB - durationA;
  });

export {
  calculateDuration,
  checkEscKeydownPress,
  humanizeDate,
  sortPointsByDate,
  sortPointsByDuration,
  sortPointsByOffersLength,
  sortPointsByPrice,
  sortPointsByType,
};

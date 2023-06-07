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

/**
 * Сортирует массив объектов event по дате начала.
 *
 * @param {EventObject[]} events - Массив объектов event для сортировки.
 * @returns {EventObject[]} - Отсортированный массив объектов event.
 */
const sortEventsByDate = (events) => events.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));

/**
 * Сортирует массив объектов event по типу в алфавитном порядке.
 *
 * @param {EventObject[]} events - Массив объектов event для сортировки.
 * @returns {EventObject[]} - Отсортированный массив объектов event.
 */
const sortEventsByType = (events) => events.sort((a, b) => a.type.localeCompare(b.type));

/**
 * Сортирует массив объектов event по длине массива offers.
 *
 * @param {EventObject[]} events - Массив объектов event для сортировки.
 * @returns {EventObject[]} - Отсортированный массив объектов event.
 */
const sortEventsByOffersLength = (events) => events.sort((a, b) => b.offers.length - a.offers.length);

/**
 * Сортирует массив объектов event по цене (basePrice).
 *
 * @param {EventObject[]} events - Массив объектов event для сортировки.
 * @returns {EventObject[]} - Отсортированный массив объектов event.
 */
const sortEventsByPrice = (events) => events.sort((a, b) => b.basePrice - a.basePrice);

/**
 * Сортирует массив объектов event по продолжительности (разнице между начальной и конечной датами).
 *
 * @param {EventObject[]} events - Массив объектов event для сортировки.
 * @returns {EventObject[]} - Отсортированный массив объектов event.
 */
const sortEventsByDuration = (events) =>
  events.sort((a, b) => {
    const durationA = dayjs(a.dateTo).diff(dayjs(a.dateFrom));
    const durationB = dayjs(b.dateTo).diff(dayjs(b.dateFrom));
    return durationB - durationA;
  });

export {
  calculateDuration,
  humanizeDate,
  sortEventsByDate,
  sortEventsByDuration,
  sortEventsByOffersLength,
  sortEventsByPrice,
  sortEventsByType,
};

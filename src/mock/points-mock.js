//@ts-check
import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
} from './commons.js';
import { POINT_TYPES } from './constants-mock.js';

/**@typedef {import('./offers-mock.js').Offer} Offer*/

export const pointId = getRandomIntGenerator();
/**
 * @typedef Point
 * @type {Object}
 * @property {string} id
 * @property {number} basePrice
 * @property {string} dateFrom
 * @property {string} dateTo
 * @property {string} destination
 * @property {boolean} isFavorite
 * @property {Array<string>} offers
 * @property {string} type
 */

/**
 * Функция для генерации события
 * @returns {Point}
 */
export const generatePoint = () => {
  let day = getRandomInteger(1, 28);
  const year = `20${getRandomInteger(10, 30)}`;
  const month = getRandomInteger(1, 12);

  const dateFrom = `${year}-${month}-${day}T${getRandomInteger(0, 11)}:${getRandomInteger(10, 59)}`;
  const dateTo = `${year}-${month}-${++day}T${getRandomInteger(0, 11)}:${getRandomInteger(10, 59)}`;

  return {
    'id': `point-${pointId()}`,
    'basePrice': getRandomInteger(100, 1000),
    dateFrom,
    dateTo,
    'destination': '',
    'isFavorite': Boolean(getRandomInteger(0, 1)),
    'offers': [],
    'type': getRandomArrayElement(POINT_TYPES)
  };
};

//@ts-check
import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
} from '../utils/commons.js';
import { EVENT_TYPES } from './constants-mock';

const eventId = getRandomIntGenerator();

/**
 * @typedef GenerateEventObject
 * @type {Object}
 * @property {string} id
 * @property {number} basePrice
 * @property {string} dateFrom
 * @property {string} dateTo
 * @property {null} destination
 * @property {number} isFavorite
 * @property {null} offers
 * @property {number} type
 */

/**
 * Функция для генерации события
 * @returns {GenerateEventObject}
 */
export const generateEvent = () => {
  let day = getRandomInteger(1, 28);
  const year = `20${getRandomInteger(10, 30)}`;
  const month = getRandomInteger(1, 12);

  const dateFrom = `${year}-${month}-${day}T${getRandomInteger(0, 11)}:${getRandomInteger(10, 59)}`;
  const dateTo = `${year}-${month}-${++day}T${getRandomInteger(0, 11)}:${getRandomInteger(10, 59)}`;

  return {
    'id': `event-${eventId()}`,
    'basePrice': getRandomInteger(100, 1000),
    dateFrom,
    dateTo,
    'destination': null,
    'isFavorite': getRandomInteger(0, 1),
    'offers': null,
    'type': getRandomArrayElement(EVENT_TYPES)
  };
};

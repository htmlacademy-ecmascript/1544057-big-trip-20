//@ts-check
import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
} from '../utils/commons.js';
import { DESCRIPTIONS } from './constants-mock';

const CITY_NAMES = ['Amsterdam', 'Chamonix', 'Geneva', 'Rome', 'New York'];
const destinationId = getRandomIntGenerator();

const generatePicture = () => ({
  'src': `https://loremflickr.com/248/152?random=${getRandomInteger(1, 100)}`,
  'description': getRandomArrayElement(DESCRIPTIONS)
});

/**
 * @typedef Id Unique identifier
 * @type {string}
 */

/**
 * @typedef Destination
 * @type {Object}
 * @property {Id} id
 * @property {string} description
 * @property {string} name
 * @property {Array<HTMLElement>} pictures
 */

/**
 * @returns {Array<Destination>}
 */
export const generateDestinations = () => {
  const destinations = [];

  CITY_NAMES.forEach((cityName) => destinations.push({
    'id': `destination-${destinationId()}`,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': cityName,
    'pictures': Array.from({ length: getRandomInteger(undefined, 10) }, generatePicture)
  })
  );

  return destinations;
};

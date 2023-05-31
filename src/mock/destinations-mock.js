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

export const generateDestinations = () => {
  const destinations = [];

  CITY_NAMES.forEach((cityName) => destinations.push({
    'id': `destination-${destinationId()}`,
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': cityName,
    'pictures': Array.from({ length: getRandomInteger(null, 10) }, generatePicture)
  })
  );

  return destinations;
};

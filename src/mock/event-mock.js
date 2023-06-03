import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
} from '../utils/commons.js';
import { EVENT_TYPES } from './constants-mock';

const eventId = getRandomIntGenerator();

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

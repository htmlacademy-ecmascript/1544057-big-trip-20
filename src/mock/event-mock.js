import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
} from '../utils';
import { EVENT_TYPES } from './constants-mock';

const eventId = getRandomIntGenerator();

export const generateEvent = () => {
  let day = getRandomInteger(1, 28);

  const month = getRandomInteger(1, 12);
  const dateFrom = `2019-${month}-${day}T${getRandomInteger(0, 11)}:${getRandomInteger(10, 59)}`;
  const dateTo = `2019-${month}-${++day}T${getRandomInteger(0, 11)}:${getRandomInteger(10, 59)}`;

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
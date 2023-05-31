import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
} from '../utils/commons.js';
import { DESCRIPTIONS, EVENT_TYPES } from './constants-mock';

const offerId = getRandomIntGenerator();

const generateOffer = () => ({
  'id': `offer-${offerId()}`,
  'title': getRandomArrayElement(DESCRIPTIONS),
  'price': getRandomInteger(50, 1000)
});

export const generateOffers = () => {
  const offers = [];

  EVENT_TYPES.forEach((eventType) => offers.push({
    'type': eventType,
    'offers': Array.from({ length: getRandomInteger(1, 10) }, generateOffer)
  })
  );

  return offers;
};

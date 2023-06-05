import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
} from '../utils/commons.js';
import { DESCRIPTIONS, EVENT_TYPES } from './constants-mock';

/**
 * @function
 * @returns {number} unique random number
 */
const offerId = getRandomIntGenerator();

/**
 * @typedef Offer
 * @type {Object}
 * @property {string} id
 * @property {string} title
 * @property {number} price
 */

/**
 * @returns {Offer}
 */
const generateOffer = () => ({
  'id': `offer-${offerId()}`,
  'title': getRandomArrayElement(DESCRIPTIONS),
  'price': getRandomInteger(50, 1000)
});

/**
 * @typedef TypeOffers
 * @type {object} Offer
 * @property {string} type
 * @property {Array<Offer>} offers
 */

/**
 * @returns {Array<TypeOffers>}
 */
export const generateOffers = () => {
  const offers = [];

  EVENT_TYPES.forEach((eventType) => offers.push({
    'type': eventType,
    'offers': Array.from({ length: getRandomInteger(1, 10) }, generateOffer)
  })
  );

  return offers;
};

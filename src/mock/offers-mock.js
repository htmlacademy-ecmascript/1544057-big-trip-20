import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
} from './commons.js';
import { DESCRIPTIONS, POINT_TYPES } from './constants-mock';

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

  POINT_TYPES.forEach((pointType) => offers.push({
    'type': pointType,
    'offers': Array.from({ length: getRandomInteger(1, 10) }, generateOffer)
  })
  );

  return offers;
};

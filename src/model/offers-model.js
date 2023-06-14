//@ts-check
import { generateOffers } from '../mock/offers-mock';

/**@typedef {import('../mock/offers-mock').TypeOffers} TypeOffers*/
/**@typedef {import('../mock/offers-mock').Offer} Offer*/

export default class OffersModel {
  /** @type {Map<string, Array<Offer>>} */
  #offers = new Map();

  constructor() {
    const generatedOffers = generateOffers();
    generatedOffers.forEach((typeOffer) => {
      this.#offers.set(typeOffer.type, typeOffer.offers);
    });
  }

  /**
   * @returns {Map<string, Array<Offer>>}
   */
  get offers() {
    return this.#offers;
  }

  /**
 * @param {string} id
 * @returns {Offer|undefined}
 */
  getById(id) {
    const offers = [...this.#offers.values()].flat();
    return offers.find((offer) => offer.id === id);
  }
}

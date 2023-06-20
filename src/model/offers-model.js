//@ts-check
import { generateOffers } from '../mock/offers-mock';

/**@typedef {import('../mock/offers-mock').Offer} Offer*/
/**@typedef {Map<string, Map<string, Offer>>} OffersByType*/

export default class OffersModel {
  #OffersByType = new Map();
  #offers = new Map();

  constructor() {
    generateOffers().forEach((typeOffer) => {
      const offers = new Map();

      typeOffer.offers.forEach((offer) => {
        this.#offers.set(offer.id, offer);
        offers.set(offer.id, offer);
      });

      this.#OffersByType.set(typeOffer.type, offers);
    });
  }

  /**
   * @returns {OffersByType}
   */
  get offers() {
    return this.#OffersByType;
  }

  /**
 * @param {string} id
 * @returns {Offer|undefined}
 */
  getOffer(id) {
    return this.#offers.get(id);
  }
}

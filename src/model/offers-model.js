//@ts-check
import { generateOffers } from '../mock/offers-mock';

/**@typedef {import('../mock/offers-mock').TypeOffers} TypeOffers*/
/**@typedef {import('../mock/offers-mock').Offer} Offer*/

export default class OffersModel {
  /** @type {Array<TypeOffers>} */
  #offers = generateOffers();

  get offers() {
    return this.#offers;
  }

  /**
   * @param {string} type
   * @returns {Array<Offer>|undefined}
   */
  getByType(type) {
    const offersPerType = this.#offers.find((offer) => offer.type === type);
    return offersPerType?.offers;
  }

  /**
   *
   * @param {string} id
   * @returns {Offer|undefined}
   */
  getById(id) {
    const offers = this.#offers.map((offer) => offer.offers).flat();
    return offers.find((offer) => offer.id === id);

  }
}

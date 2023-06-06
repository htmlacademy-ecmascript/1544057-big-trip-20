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
   * @returns {Array<Offer>}
   */
  getByType(type) {
    const offersPerType = this.#offers.find((offer) => offer.type === type);
    const result = offersPerType?.offers ? offersPerType.offers : [];
    return result;
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

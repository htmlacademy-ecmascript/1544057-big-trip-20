import { generateOffers } from '../mock/offers-mock';

export default class OffersModel {
  #offers = generateOffers();

  getAll() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
  }
}

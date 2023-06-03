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

  getById(id) {
    const offers = this.#offers.map((offer) => offer.offers).flat();
    return offers.find((offer) => offer.id === id);

  }
}

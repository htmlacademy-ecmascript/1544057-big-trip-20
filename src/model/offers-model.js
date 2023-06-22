import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #appApiService;
  #offersByType = new Map();
  #offers = new Map();

  /** @param {{appApiService: AppApiService}} props*/
  constructor({ appApiService }) {
    super();
    this.#appApiService = appApiService;
  }

  /**
   * @returns {OffersByType}
   */
  get offers() {
    return this.#offersByType;
  }

  async init() {
    const OffersByType = await this.#appApiService.offers;

    OffersByType.forEach((typeOffer) => {
      const offers = new Map();

      typeOffer.offers.forEach((offer) => {
        this.#offers.set(offer.id, offer);
        offers.set(offer.id, offer);
      });

      this.#offersByType.set(typeOffer.type, offers);
    });
  }

  /**
   * @param {string} id
   * @returns {Offer|undefined}
   */
  getOffer(id) {
    return this.#offers.get(id);
  }
}

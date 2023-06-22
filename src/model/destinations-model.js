import Observable from '../framework/observable';

/**
 *@typedef { import('../mock/destinations-mock').Destination} Destination
 *@typedef { import('../app-api-service').default} AppApiService
 *@typedef { Map<string, Destination>} Destinations
 */
export default class DestinationsModel extends Observable {
  #appApiService;
  /** @type {Destinations} */
  #destinations;

  /** @param {{appApiService: AppApiService}} props*/
  constructor({ appApiService }) {
    super();
    this.#appApiService = appApiService;
  }


  /**
   * @returns {Destinations} Destinations map
  */
  get destinations() {
    return this.#destinations;
  }

  async init() {
    const destination = await this.#appApiService.destinations;
    this.#destinations = this.#adaptToClient(destination);
  }

  #adaptToClient(destinations) {
    const adaptDestinations = new Map();

    destinations.forEach((destination) => {
      adaptDestinations.set(destination.id, destination);
    });

    return adaptDestinations;
  }

}

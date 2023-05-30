import { generateDestinations } from '../mock/destinations-mock';

export default class DestinationsModel {
  #destinations = generateDestinations();

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }
}

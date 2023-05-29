import { generateDestinations } from '../mock/destinations-mock';

export default class DestinationsModel {
  #destinations = generateDestinations();

  getAll() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }
}

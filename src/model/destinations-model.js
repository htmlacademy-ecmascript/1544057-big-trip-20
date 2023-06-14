//@ts-check
import { generateDestinations } from '../mock/destinations-mock';

/**
 *@typedef { import('../mock/destinations-mock').Destination} Destination
 */
export default class DestinationsModel {
  /** @type {Map<string, Destination>} */
  #destinations = new Map();

  constructor() {
    const generatedDestinations = generateDestinations();
    generatedDestinations.forEach((destination) => {
      this.#destinations.set(destination.id, destination);
    });
  }

  /**
   * @returns {Map<string, Destination>} Destinations
   */
  get destinations() {
    return this.#destinations;
  }

  /**
   * @param {string} id
   * @returns {Destination|undefined} Destination
   */
  getById(id) {
    return this.#destinations.get(id);
  }
}

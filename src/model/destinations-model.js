//@ts-check
import { generateDestinations } from '../mock/destinations-mock';

/**
 *@typedef { import('../mock/destinations-mock').Destination} Destination
 */
export default class DestinationsModel {
  /**@type{Array<Destination>}*/
  #destinations = generateDestinations();

  get destinations() {
    return this.#destinations;
  }

  /**
   * @param {string} id
   */
  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }
}

import { MAX_SELECT_OFFERS } from '../constants';
import { generateEvent } from '../mock/event-mock';
import { getRandomArrayElement, getRandomInteger } from '../utils/commons';

/**
 * @typedef Params
 * @type {Object}
 * @property {Object} destinationsModel
 * @property {Object} offersModel
 */

/**
 * Модель События
 */
export default class EventModel {
  /**@type {Object}*/
  #destinationsModel;
  /**@type {Object}*/
  #offersModel;
  /**@type {Array} */
  #offers;
  #event = generateEvent();

  /** @param {Params} params*/
  constructor({ destinationsModel, offersModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#offers = this.#offersModel.getByType(this.#event.type);
  }

  /**
    * @typedef EventObject
    * @type {Object}
    * @property {string} id
    * @property {number} basePrice
    * @property {string} dateFrom
    * @property {string} dateTo
    * @property {string} destination
    * @property {number} isFavorite
    * @property {Array<string>} offers
    * @property {string} type
    */

  /**
   * @returns {EventObject}
   */
  get event() {
    this.#event.destination = getRandomArrayElement(this.#destinationsModel.destinations).id;
    this.#event.offers = Array.from({ length: getRandomInteger(1, MAX_SELECT_OFFERS) }, () => getRandomArrayElement(this.#offers).id);
    return this.#event;
  }
}

//@ts-check
import { MAX_SELECT_OFFERS } from '../constants';
import { generateEvent } from '../mock/event-mock';
import { getRandomArrayElement, getRandomInteger } from '../utils/commons';

/**
 * @typedef Params
 * @type {Object}
 * @property {import('./destinations-model').default} destinationsModel
 * @property {import('./offers-model').default} offersModel
 */

/**
 * Модель События
 */
export default class EventModel {
  /**@type {import('./destinations-model').default}*/
  #destinationsModel;
  /**@type {import('./offers-model').default}*/
  #offersModel;
  /**@type {Array} */
  #offers;
  #event = generateEvent();

  /**
   * @param {Params} params
   */
  constructor({ destinationsModel, offersModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#offers = this.#offersModel.getByType(this.#event.type);
  }

  /**
    * @typedef {import('../mock/event-mock').EventObject} EventObject
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

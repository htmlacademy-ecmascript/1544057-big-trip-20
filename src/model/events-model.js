//@ts-check
import { MAX_EVENTS, MIN_EVENTS } from '../constants';
import EventModel from '../model/event-model';
import { getRandomInteger } from '../utils/commons';

/**
* @typedef {import('../mock/event-mock').EventObject} EventObject
*/
export default class EventsModel {
  #destinationsModel;
  #offersModel;
  /** @type{Array<EventObject>} */
  #events;

  /**
   * @typedef Params
   * @type {Object}
   * @property {object} destinationsModel
   * @property {object} offersModel
   */

  /**
   * @param {Params} params
   */
  constructor({ destinationsModel, offersModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#events = Array.from({ length: getRandomInteger(MIN_EVENTS, MAX_EVENTS) }, () => {
      /**@type{EventModel} */
      const eventModel = new EventModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });

      return eventModel.event;
    });
  }

  /**
   * @returns {Array<EventObject>}
   */
  get events() {
    return this.#events;
  }

  /**
   * @param{Array<EventObject>} events
   */
  set events(events) {
    this.#events = events;
  }

  /**
   * @param {string} id
   * @returns {?EventObject}
   */
  getById(id) {
    const result = this.events.find((event) => event.id === id);
    return result ? result : null;
  }
}

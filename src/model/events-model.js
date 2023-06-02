import { MAX_EVENTS, MIN_EVENTS } from '../constants';
import EventModel from '../model/event-model';
import { getRandomInteger } from '../utils/commons';

export default class EventsModel {
  #destinationsModel = null;
  #offersModel = null;
  #events = null;

  constructor({ destinationsModel, offersModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }


  get events() {
    if (!this.#events) {
      this.#events = Array.from({ length: getRandomInteger(MIN_EVENTS, MAX_EVENTS) }, () => {
        const eventModel = new EventModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });

        return eventModel.event;
      });
    }
    return this.#events;
  }

  getById(id) {
    return this.events
      .find((events) => events.id === id);
  }
}

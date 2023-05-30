import { generateEvent } from '../mock/event-mock';
import { getRandomArrayElement } from '../utils';

export default class EventModel {
  #destinationsModel = null;
  #offersModel = null;

  constructor({ destinationsModel, offersModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  #event = generateEvent();

  get event() {
    const offers = this.#offersModel.getByType(this.#event.type);
    this.#event.destination = getRandomArrayElement(this.#destinationsModel.destinations).id;
    this.#event.offers = offers.map((offer) => offer.id);
    return this.#event;
  }
}

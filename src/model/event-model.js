import { MAX_SELECT_OFFERS } from '../constants';
import { generateEvent } from '../mock/event-mock';
import { getRandomArrayElement, getRandomInteger } from '../utils/commons';

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
    this.#event.offers = Array.from({ length: getRandomInteger(1, MAX_SELECT_OFFERS) }, () => getRandomArrayElement(offers).id);
    return this.#event;
  }
}

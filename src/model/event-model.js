import { generateEvent } from '../mock/event-mock';
import { getRandomArrayElement } from '../utils';

export default class EventModel {
  constructor({ destinationsModel, offersModel }) {
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  event = generateEvent();

  get() {
    const offers = this.offersModel.getByType(this.event.type);
    this.event.destination = getRandomArrayElement(this.destinationsModel.getAll()).id;
    this.event.offers = offers.map((offer) => offer.id);
    return this.event;
  }
}

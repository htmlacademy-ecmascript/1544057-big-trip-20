import EventModel from '../model/event-model';
import { EVENT_COUNT } from '../constants';
import { getRandomInteger } from '../utils';

export default class EventsModel {
  constructor({ destinationsModel, offersModel }) {
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }


  getAll() {
    const events = Array.from({ length: getRandomInteger(EVENT_COUNT, 15) }, () => {
      const eventModel = new EventModel({ destinationsModel: this.destinationsModel, offersModel: this.offersModel });

      return eventModel.get();
    });
    return events;
  }

  getById(id) {
    return this.events
      .find((events) => events.id === id);
  }
}
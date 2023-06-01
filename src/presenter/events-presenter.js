import { EVENT_COUNT } from '../constants.js';
import { render, RenderPosition, replace } from '../framework/render.js';
import DestinationsModel from '../model/destinations-model';
import EventsModel from '../model/events-model';
import OffersModel from '../model/offers-model';
import { checkEcsKeydownPress } from '../utils/commons.js';
import EventFormView from '../view/event/event-form-view.js';
import EventInfoView from '../view/event/event-info-view';

export default class EventsPresenter {
  #eventsListContainer = null;
  #events = null;
  #destinationsModel = new DestinationsModel();
  #offersModel = new OffersModel();
  #eventsModel = new EventsModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });

  constructor({ eventsListContainer }) {
    this.#eventsListContainer = eventsListContainer;
  }

  init() {
    this.#events = [...this.#eventsModel.events];

    this.#renderEvents();
  }

  #renderEvents() {
    for (let i = 0; i < EVENT_COUNT; i++) {
      const event = this.#events[i];
      const destination = this.#destinationsModel.getById(event.destination);

      const eventInfo = {
        'eventType': event.type,
        'eventCityName': destination.name,
        'eventPrice': event.basePrice,
        'isFavorite': event.isFavorite,
        'eventStartDate': event.dateFrom,
        'eventEndDate': event.dateTo,
        destination,
        'offers': this.#offersModel.getByType(event.type)
      };

      this.#renderEvent(eventInfo);
    }
  }

  #renderEvent(eventInfo) {
    const eventInfoComponent = new EventInfoView({
      eventInfo, onButtonClick: () => {
        replaceEventToForm();
        document.addEventListener('keydown', ecsKeydownHandler);
      }
    });
    const eventFormComponent = new EventFormView({
      formType: 'editForm', eventInfo, destinations: this.#destinationsModel.destinations, onButtonClick: () => {
        replaceFormToEvent();
      }
    });

    render(eventInfoComponent, this.#eventsListContainer, RenderPosition.BEFOREEND);


    function ecsKeydownHandler(event) {
      checkEcsKeydownPress(event, replaceFormToEvent);
    }

    function replaceFormToEvent() {
      replace(eventInfoComponent, eventFormComponent);
      document.removeEventListener('keydown', ecsKeydownHandler);
    }

    function replaceEventToForm() {
      replace(eventFormComponent, eventInfoComponent);
    }
  }
}

import { FormTypes } from '../constants.js';
import { render, RenderPosition, replace } from '../framework/render.js';
import { checkEcsKeydownPress } from '../utils/commons.js';
import EventFormView from '../view/event/event-form-view.js';
import EventInfoView from '../view/event/event-info-view';

export default class EventsPresenter {
  #eventsListContainer = null;
  #events = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;

  constructor({ eventsListContainer, eventsModel, offersModel, destinationsModel }) {
    this.#eventsListContainer = eventsListContainer;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];

    this.#renderEvents();
  }

  #renderEvents() {
    for (let i = 0; i < this.#events.length; i++) {
      const event = this.#events[i];
      const destination = this.#destinationsModel.getById(event.destination);

      const EventInfo = {
        'eventType': event.type,
        'eventCityName': destination.name,
        'eventPrice': event.basePrice,
        'isFavorite': event.isFavorite,
        'eventStartDate': event.dateFrom,
        'eventEndDate': event.dateTo,
        destination,
        'offers': event.offers.map((offer) => this.#offersModel.getById(offer, event.type))
      };

      this.#renderEvent(EventInfo);
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
      formType: FormTypes.EDIT_FORM, eventInfo, destinations: this.#destinationsModel.destinations, onButtonClick: () => {
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

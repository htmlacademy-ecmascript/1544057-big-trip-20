import { EVENT_COUNT } from '../constants.js';
import { render, RenderPosition, replace } from '../framework/render.js';
import DestinationsModel from '../model/destinations-model';
import EventsModel from '../model/events-model';
import OffersModel from '../model/offers-model';
import { checkEcsKeydownPress } from '../utils.js';
import EventFormView from '../view/event/event-form-view.js';
import EventInfoView from '../view/event/event-info-view';
import EventsItemView from '../view/events-item-view.js';

export default class EventsPresenter {
  #eventsListContainer = null;

  constructor({ eventsListContainer }) {
    this.#eventsListContainer = eventsListContainer;
  }

  #destinationsModel = new DestinationsModel();
  #offersModel = new OffersModel();
  #eventsModel = new EventsModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });
  #events = this.#eventsModel.events;

  init() {
    for (let i = 0; i < EVENT_COUNT; i++) {
      const event = this.#events[i];
      const destination = this.#destinationsModel.getById(event.destination);
      // { formType, description, offers, eventType, eventCityName, eventStartDate, eventEndDate, eventPrice, destinations; }
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
    const eventItemComponent = new EventsItemView();
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

    render(eventItemComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);
    const eventsItemContainerNode = this.#eventsListContainer.querySelector('.trip-events__item');

    render(eventInfoComponent, eventsItemContainerNode, RenderPosition.BEFOREEND);


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

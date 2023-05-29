import { EVENT_COUNT, FormTypes, MAX_SELECT_OFFERS } from '../constants.js';
import { render, RenderPosition } from '../framework/render.js';
import DestinationsModel from '../model/destinations-model';
import EventsModel from '../model/events-model';
import OffersModel from '../model/offers-model';
import EventFormView from '../view/event/event-form-view/event-form-view.js';
import EventFormDestinationView
  from '../view/event/event-form-view/form-details-view/event-form-destination-view.js';
import EventFormDetailsView
  from '../view/event/event-form-view/form-details-view/event-form-details-view.js';
import EventFormOffersView
  from '../view/event/event-form-view/form-details-view/event-form-offers-view.js';
import EventFromHeaderTypeView
  from '../view/event/event-form-view/form-header-view/header-types-view.js';
import EventFormHeaderView
  from '../view/event/event-form-view/form-header-view/header-view.js';
import EventInfoView from '../view/event/event-info-view';
import EventOfferView from '../view/event/event-offer-view.js';
import EventsItemView from '../view/events-item-view.js';

export default class EventsPresenter {
  constructor({ eventsListContainer }) {
    this.eventsListContainer = eventsListContainer;
  }

  #destinationsModel = new DestinationsModel();
  #offersModel = new OffersModel();
  #eventsModel = new EventsModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });

  init() {
    const events = this.#eventsModel.getAll();
    for (let i = 0; i < EVENT_COUNT; i++) {
      const event = events[i];


      const eventInfo = {
        'eventType': event.type,
        'eventCityName': this.#destinationsModel.getById(event.destination).name,
        'eventPrice': event.basePrice,
        'isFavorite': event.isFavorite,
        'eventStartDate': event.dateFrom,
        'eventEndDate': event.dateTo
      };

      render(new EventsItemView(), this.eventsListContainer, RenderPosition.AFTERBEGIN);
      const eventContainerNode = this.eventsListContainer.querySelector('.trip-events__item');

      if (i === EVENT_COUNT - 1) {
        render(new EventFormView(), eventContainerNode, RenderPosition.AFTERBEGIN);

        const eventFromConstainerNode = document.querySelector('.event--edit');
        render(new EventFormDetailsView(), eventFromConstainerNode, RenderPosition.BEFOREEND);
        render(new EventFormHeaderView({ formType: FormTypes.EDIT_FORM, eventInfo: eventInfo, destinations: this.#destinationsModel.getAll() }), eventFromConstainerNode, RenderPosition.AFTERBEGIN);

        const eventFormHeaderContainerNode = eventFromConstainerNode.querySelector('.event__header');
        render(new EventFromHeaderTypeView(eventInfo.eventType), eventFormHeaderContainerNode, RenderPosition.AFTERBEGIN);

        const eventFormDetailsConstainerNode = eventContainerNode.querySelector('.event__details');
        render(new EventFormOffersView(this.#offersModel.getByType(eventInfo.eventType)), eventFormDetailsConstainerNode, RenderPosition.BEFOREEND);
        render(new EventFormDestinationView(this.#destinationsModel.getById(event.destination)), eventFormDetailsConstainerNode, RenderPosition.BEFOREEND);
        continue;
      }

      render(new EventInfoView(eventInfo), eventContainerNode, RenderPosition.BEFOREEND);

      const offersContainerNode = eventContainerNode.querySelector('.event__selected-offers');
      const offers = this.#offersModel.getByType(event.type);

      for (let j = 0; j < offers.length; j++) {
        const offer = offers[j];
        if (j === MAX_SELECT_OFFERS) {
          break;
        }

        render(new EventOfferView(offer), offersContainerNode, RenderPosition.BEFOREEND);
      }
    }
  }

  // #renderEvent(event) {
  //   const event
  // }
}

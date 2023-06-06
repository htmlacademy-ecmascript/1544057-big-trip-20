import { Filters } from '../constants.js';
import { render, RenderPosition } from '../framework/render.js';
import DestinationsModel from '../model/destinations-model';
import EventsModel from '../model/events-model';
import OffersModel from '../model/offers-model';
import EventsEmplyView from '../view/events-emply-view.js';
import EventsListView from '../view/events-list-view.js';
import EventSortView from '../view/events-sort-view.js';
import EventPresenter from './event-presenter.js';
import FiltersPresenter from './filters-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';

/**
 * @typedef EventInfo
 * @type {Object}
 * @property {string} eventType
 * @property {string|undefined} eventCityName
 * @property {number} eventPrice
 * @property {boolean} isFavorite
 * @property {string} eventStartDate
 * @property {string} eventEndDate
 * @property {object} destination
 * @property {Array<object>} offers
*/
export default class PagePresenter {
  /**@type{FiltersPresenter} */
  #filtersPresenter;
  #tripInfoPresenter;
  #eventsEmplyComponent;
  #eventSortComponent = new EventSortView();
  #eventsListComponent = new EventsListView();
  #destinationsModel = new DestinationsModel();
  #offersModel = new OffersModel();
  #eventsModel = new EventsModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });
  #tripEvents = [...this.#eventsModel.events];
  /**@type{Map<string, EventPresenter>} */
  #eventPresenters = new Map();

  init() {
    const filterContinerNode = document.querySelector('.trip-controls__filters');
    const eventsConstainerNode = document.querySelector('.trip-events');
    const tripInfoContinerNode = document.querySelector('.trip-main');

    this.#filtersPresenter = new FiltersPresenter({ events: this.#tripEvents, FiltersContainer: filterContinerNode });
    this.#tripInfoPresenter = new TripInfoPresenter({ container: tripInfoContinerNode, destinationsModel: this.#destinationsModel, offersModel: this.#offersModel, eventsModel: this.#eventsModel });
    this.#eventsEmplyComponent = new EventsEmplyView(Filters.EVERYTHING);

    this.#filtersPresenter.init();

    if (this.#tripEvents.length > 0) {
      this.#tripInfoPresenter.init();
      this.#renderEventsList(eventsConstainerNode);

      return;
    }

    render(this.#eventsEmplyComponent, eventsConstainerNode, RenderPosition.BEFOREEND);
  }

  #renderEventsList(eventsConstainerNode) {
    render(this.#eventSortComponent, eventsConstainerNode, RenderPosition.AFTERBEGIN);
    render(this.#eventsListComponent, eventsConstainerNode, RenderPosition.BEFOREEND);

    this.#tripEvents.forEach((event) => {
      const destination = this.#destinationsModel.getById(event.destination);

      /**@type {EventInfo}*/
      const EventInfo = {
        'eventType': event.type,
        'eventCityName': destination?.name,
        'eventPrice': event.basePrice,
        'isFavorite': Boolean(event.isFavorite),
        'eventStartDate': event.dateFrom,
        'eventEndDate': event.dateTo,
        destination,
        'offers': event.offers.map((/** @type {object} */ offer) => this.#offersModel.getById(offer))
      };

      const eventPresenter = new EventPresenter({ eventsListContainer: this.#eventsListComponent.element, destinations: this.#destinationsModel.destinations });
      eventPresenter.init(EventInfo);
      this.#eventPresenters.set(event.id, eventPresenter);
    });
  }

  #clearEventPresenters() {
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();
  }
}

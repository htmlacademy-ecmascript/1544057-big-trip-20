//@ts-check
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
  #eventsEmplyComponent = new EventsEmplyView(Filters.EVERYTHING);
  #eventSortComponent = new EventSortView();
  #eventsListComponent = new EventsListView();
  #destinationsModel = new DestinationsModel();
  #offersModel = new OffersModel();
  #eventsModel = new EventsModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });
  #tripEvents = [...this.#eventsModel.events];

  init() {
    this.#renderHeader();
    this.#renderBody();
  }

  #renderHeader() {
    if (this.#tripEvents.length > 0) {

      const tripInfoContinerNode = document.querySelector('.trip-main');

      if (tripInfoContinerNode instanceof HTMLElement) {
        const tripInfoPresenter = new TripInfoPresenter({ container: tripInfoContinerNode, destinationsModel: this.#destinationsModel, offersModel: this.#offersModel, eventsModel: this.#eventsModel });
        tripInfoPresenter.init();
      }

    }

    const filterContinerNode = document.querySelector('.trip-controls__filters');

    if (filterContinerNode instanceof HTMLElement) {
      this.#filtersPresenter = new FiltersPresenter({ events: this.#tripEvents, FiltersContainer: filterContinerNode });
      this.#filtersPresenter.init();
    }

  }

  #renderBody() {
    const eventsConstainerNode = document.querySelector('.trip-events');

    if (eventsConstainerNode instanceof HTMLElement) {

      if (this.#tripEvents.length > 0) {
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
        });

        return;
      }

      render(this.#eventsEmplyComponent, eventsConstainerNode, RenderPosition.BEFOREEND);
    }
  }
}

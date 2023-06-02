import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { Filters } from '../constants.js';
import { render, RenderPosition } from '../framework/render.js';
import DestinationsModel from '../model/destinations-model';
import EventsModel from '../model/events-model';
import OffersModel from '../model/offers-model';
import EventsEmplyView from '../view/events-emply-view.js';
import EventsFilterView from '../view/events-filter-view.js';
import EventsListView from '../view/events-list-view.js';
import EventSortView from '../view/events-sort-view.js';
import TripInfoView from '../view/trip-info-view';
import EventsPresenter from './events-presenter.js';

dayjs.extend(isBetween);

export default class PagePresenter {
  #tripInfoComponent = null;
  #eventsFiltersComponent = null;
  #eventsEmplyComponent = new EventsEmplyView(Filters.EVERYTHING);
  #eventSortComponent = new EventSortView();
  #eventsListComponent = new EventsListView();
  #destinationsModel = new DestinationsModel();
  #offersModel = new OffersModel();
  #eventsModel = new EventsModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });

  init() {
    const events = [...this.#eventsModel.events];
    this.#renderHeader(events);
    this.#renderBody(events);
  }


  #renderHeader(events) {
    if (events.length > 0) {
      this.#renderTripInfo(events);
    }
    this.#renderFilters(events);
  }

  #renderTripInfo(events) {
    const summary = (...arr) => arr.reduce((partialSum, a) => partialSum + a, 0);

    const eventsCity = events.map((event) => this.#destinationsModel.getById(event.destination).name);

    const eventsDates = events.map((event) => event.dateFrom);

    const offersId = events.map((event) => event.offers).flat();
    const offersCost = offersId.map((id) => this.#offersModel.getById(id).price);
    const eventsCost = events.map((event) => event.basePrice);
    const tripCost = summary(...offersCost, ...eventsCost);

    this.#tripInfoComponent = new TripInfoView({ eventsDates, eventsCity, tripCost });

    const tripInfoContinerNode = document.querySelector('.trip-main');
    render(this.#tripInfoComponent, tripInfoContinerNode, RenderPosition.AFTERBEGIN);
  }

  #renderFilters(events) {
    const presentEvents = events.filter((event) => dayjs().isBetween(event.dateFrom, dayjs(event.dateTo)));
    const futureEvents = events.filter((event) => dayjs().isBefore(dayjs(event.dateFrom)));
    const pastEvents = events.filter((event) => dayjs().isAfter(dayjs(event.dateTo)));

    const FiltersConfig = {
      [Filters.EVERYTHING]: {
        checked: true,
        disabled: events.length <= 0,
      },
      [Filters.FUTURE]: {
        checked: false,
        disabled: futureEvents <= 0,
      },
      [Filters.PAST]: {
        checked: false,
        disabled: pastEvents <= 0,
      },
      [Filters.PRESENT]: {
        checked: false,
        disabled: presentEvents <= 0,
      },
    };

    this.#eventsFiltersComponent = new EventsFilterView(FiltersConfig);

    const filterContinerNode = document.querySelector('.trip-controls__filters');
    render(this.#eventsFiltersComponent, filterContinerNode, RenderPosition.AFTERBEGIN);

  }

  #renderBody(events) {
    const eventsConstainerNode = document.querySelector('.trip-events');

    if (events.length > 0) {
      render(this.#eventSortComponent, eventsConstainerNode, RenderPosition.AFTERBEGIN);
      render(this.#eventsListComponent, eventsConstainerNode, RenderPosition.BEFOREEND);

      const eventListContinerNode = document.querySelector('.trip-events__list');
      const eventsPresenter = new EventsPresenter({ eventsListContainer: eventListContinerNode, eventsModel: this.#eventsModel, offersModel: this.#offersModel, destinationsModel: this.#destinationsModel });

      eventsPresenter.init();
      return true;
    }
    render(this.#eventsEmplyComponent, eventsConstainerNode, RenderPosition.BEFOREEND);
  }
}

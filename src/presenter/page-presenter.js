import { render, RenderPosition } from '../framework/render.js';
import EventsFilterView from '../view/events-filter-view';
import EventsListView from '../view/events-list-view.js';
import EventSortView from '../view/events-sort-view.js';
import TripInfoView from '../view/trip-info-view';
import EventsPresenter from './events-presenter.js';

export default class PagePresenter {
  #tripInfoComponent = new TripInfoView();
  #eventsFiltersComponent = new EventsFilterView();
  #eventSortComponent = new EventSortView();
  #eventsListComponent = new EventsListView();

  init() {
    this.#renderHeader();
    this.#renderBody();
  }

  #renderHeader() {
    const filterContinerNode = document.querySelector('.trip-controls__filters');
    const tripInfoContinerNode = document.querySelector('.trip-main');

    render(this.#tripInfoComponent, tripInfoContinerNode, RenderPosition.AFTERBEGIN);
    render(this.#eventsFiltersComponent, filterContinerNode, RenderPosition.AFTERBEGIN);
  }

  #renderBody() {
    const eventsConstainerNode = document.querySelector('.trip-events');
    render(this.#eventSortComponent, eventsConstainerNode, RenderPosition.AFTERBEGIN);
    render(this.#eventsListComponent, eventsConstainerNode, RenderPosition.BEFOREEND);

    const eventListContinerNode = document.querySelector('.trip-events__list');
    const eventsPresenter = new EventsPresenter({ eventsListContainer: eventListContinerNode });

    eventsPresenter.init();
  }
}

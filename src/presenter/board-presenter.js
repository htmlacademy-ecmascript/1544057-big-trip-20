import { render, RenderPosition } from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import EventSortView from '../view/events-sort-view.js';
import EventsPresenter from './events-presenter.js';

export default class BoardPresenter {
  #eventSortComponent = new EventSortView();
  #eventsListComponent = new EventsListView();

  init() {
    const eventsConstainerNode = document.querySelector('.trip-events');
    render(this.#eventSortComponent, eventsConstainerNode, RenderPosition.AFTERBEGIN);
    render(this.#eventsListComponent, eventsConstainerNode, RenderPosition.BEFOREEND);

    const eventListContinerNode = document.querySelector('.trip-events__list');
    const eventsPresenter = new EventsPresenter({ eventsListContainer: eventListContinerNode });

    eventsPresenter.init();
  }
}

import { FilterTypes, SortTypes } from '../constants.js';
import { render, RenderPosition } from '../framework/render.js';
import DestinationsModel from '../model/destinations-model';
import EventsModel from '../model/events-model';
import OffersModel from '../model/offers-model';
import { updateItem } from '../utils/commons.js';
import {
  sortEventsByDate,
  sortEventsByDuration,
  sortEventsByOffersLength,
  sortEventsByPrice,
  sortEventsByType,
} from '../utils/events.js';
import EventsEmplyView from '../view/events-emply-view.js';
import EventsListView from '../view/events-list-view.js';
import EventsSortView from '../view/events-sort-view.js';
import EventPresenter from './event-presenter.js';
import FiltersPresenter from './filters-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';

/**@typedef {import('../model/events-model.js').EventObject} EventObject */
/**@typedef {import('../model/offers-model.js').Offer} Offer */

/**
 * Презентер страницы.
 */
export default class PagePresenter {
  #eventsConstainerNode;
  /**@type{FiltersPresenter} */
  #filtersPresenter;
  #tripInfoPresenter;
  #eventsEmplyComponent;
  #eventSortComponent;
  #eventsListComponent = new EventsListView();
  #destinationsModel = new DestinationsModel();
  #offersModel = new OffersModel();
  #eventsModel = new EventsModel({ destinationsModel: this.#destinationsModel, offersModel: this.#offersModel });
  #tripEvents = [...this.#eventsModel.events];
  /**@type{Map<string, EventPresenter>} */
  #eventPresenters = new Map();
  #sortedEvents = [];
  #currentSortType = SortTypes.DEFAULT;

  init() {
    const filterContinerNode = document.querySelector('.trip-controls__filters');
    this.#eventsConstainerNode = document.querySelector('.trip-events');
    const tripInfoContinerNode = document.querySelector('.trip-main');

    this.#filtersPresenter = new FiltersPresenter({ events: this.#tripEvents, FiltersContainer: filterContinerNode });
    this.#tripInfoPresenter = new TripInfoPresenter({ container: tripInfoContinerNode, destinationsModel: this.#destinationsModel, offersModel: this.#offersModel, eventsModel: this.#eventsModel });
    this.#eventsEmplyComponent = new EventsEmplyView(FilterTypes.EVERYTHING);

    this.#filtersPresenter.init();

    if (this.#tripEvents.length > 0) {
      this.#tripInfoPresenter.init();
      this.#renderEventsSorts();
      this.#renderEvents();

      return;
    }

    render(this.#eventsEmplyComponent, this.#eventsConstainerNode, RenderPosition.BEFOREEND);
  }

  /**
   * Рендерит компонент сортировки событий.
   * @private
   */
  #renderEventsSorts() {
    this.#eventSortComponent = new EventsSortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#eventSortComponent, this.#eventsConstainerNode, RenderPosition.AFTERBEGIN);
  }

  #sortEvents() {
    switch (this.#currentSortType) {
      case SortTypes.DEFAULT:
        this.#sortedEvents = sortEventsByDate(this.#tripEvents);
        break;
      case SortTypes.EVENT:
        this.#sortedEvents = sortEventsByType(this.#tripEvents);
        break;
      case SortTypes.TIME:
        this.#sortedEvents = sortEventsByDuration(this.#tripEvents);
        break;
      case SortTypes.PRICE:
        this.#sortedEvents = sortEventsByPrice(this.#tripEvents);
        break;
      case SortTypes.OFFERS:
        this.#sortedEvents = sortEventsByOffersLength(this.#tripEvents);
        break;
      default:
        this.#sortedEvents = this.#tripEvents;
        break;
    }
  }

  /**
   * Рендерит компоненты для блока событий
   * @private
   */
  #renderEvents() {
    render(this.#eventsListComponent, this.#eventsConstainerNode, RenderPosition.BEFOREEND);
    this.#sortEvents();
    this.#sortedEvents.forEach((event) => {
      const eventPresenter = new EventPresenter({
        eventsListContainer: this.#eventsListComponent.element,
        destinationsModel: this.#destinationsModel,
        offersModel: this.#offersModel,
        onDataChanged: this.#handleEventChange,
        onModeChange: this.#handleModeChange
      });

      eventPresenter.init(event);
      this.#eventPresenters.set(event.id, eventPresenter);
    });
  }

  /**
  * Обработчик изменения данных события.
  * @param {EventObject} updateEvent - Обновленное событие.
  * @private
  */
  #handleEventChange = (updateEvent) => {
    this.#tripEvents = updateItem(this.#tripEvents, updateEvent);
    this.#eventPresenters.get(updateEvent.id).init(updateEvent);
  };

  /**
 * Обработчик изменения типа сортировки.
 * @param {string} sortType - Тип сортировки.
 * @private
 */
  #handleSortTypeChange = (sortType) => {
    const type = sortType.split('-')[1];
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = type;
    this.#clearEventPresenters();
    this.#renderEvents();
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  /**
 * Очищает презентеры событий.
 * @private
 */
  #clearEventPresenters() {
    this.#eventPresenters.forEach((eventPresenter) => eventPresenter.destroy());
    this.#eventPresenters.clear();
  }
}

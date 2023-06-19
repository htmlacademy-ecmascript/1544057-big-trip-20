//@ts-check
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { FilterTypes } from '../constants.js';
import { render, RenderPosition } from '../framework/render.js';
import EventsFilterView from '../view/events-filter-view.js';

dayjs.extend(isBetween);

/** Пресентер фильтров*/
export default class FiltersPresenter {
  #filtersContainer;
  /**@property {Array<object>} tripEvents Массив событий событий маршрута*/
  #tripEvents;
  /** @type {Array<object>} Массив событий которые будут сегодня*/
  #presentEvents;
  /** @type {Array<object>} Массив событий которые будут в будущем*/
  #futureEvents;
  /** @type {Array<object>} Массив событий которые были в прошлом*/
  #pastEvents;
  /** @type {Object} Объект конфигурации фильтров */
  #filterConfig;
  /** @type {EventsFilterView}*/
  #eventsFiltersComponent;

  /**
   * @typedef Params
   * @type {Object}
   * @property {Array<object>} events
   * @property {HTMLElement} FiltersContainer
   */

  /** @param {Params} params*/
  constructor({ events, FiltersContainer }) {
    this.#filtersContainer = FiltersContainer;
    this.#tripEvents = events;

    this.#presentEvents = this.#tripEvents.filter((event) => dayjs().isBetween(event.dateFrom, dayjs(event.dateTo)));
    this.#futureEvents = this.#tripEvents.filter((event) => dayjs().isBefore(dayjs(event.dateFrom)));
    this.#pastEvents = this.#tripEvents.filter((event) => dayjs().isAfter(dayjs(event.dateTo)));

    this.#filterConfig = {
      [FilterTypes.EVERYTHING]: {
        checked: true,
        disabled: this.#tripEvents.length <= 0,
      },
      [FilterTypes.FUTURE]: {
        checked: false,
        disabled: this.#futureEvents.length <= 0,
      },
      [FilterTypes.PAST]: {
        checked: false,
        disabled: this.#pastEvents.length <= 0,
      },
      [FilterTypes.PRESENT]: {
        checked: false,
        disabled: this.#presentEvents.length <= 0,
      },
    };

    this.#eventsFiltersComponent = new EventsFilterView(this.#filterConfig);
  }

  /**Метод для отрисовки фильтров */
  init() {
    render(this.#eventsFiltersComponent, this.#filtersContainer, RenderPosition.AFTERBEGIN);
  }
}

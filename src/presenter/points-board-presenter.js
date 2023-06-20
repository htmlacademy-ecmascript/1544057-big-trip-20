//@ts-checks
import {
  FilterTypes,
  SortTypes,
  UpdateType,
  UserAction,
} from '../constants.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { filters } from '../utils/filters.js';
import {
  sortPointsByDate,
  sortPointsByDuration,
  sortPointsByOffersLength,
  sortPointsByPrice,
} from '../utils/points.js';
import PointsEmplyView from '../view/points-emply-view.js';
import PointsListView from '../view/points-list-view.js';
import PointsSortView from '../view/points-sort-view.js';
import PointPresenter from './point-presenter.js';

/**@typedef {import('../model/points-model.js').PointObject} PointObject */
/**@typedef {import('../model/points-model.js').Points}  Points*/
/**@typedef {import('../model/offers-model.js').default} OffersModel */
/**@typedef {import('../model/destinations-model.js').default} DestinationsModel */
/**@typedef {import('../model/points-model.js').default} DestinationsModel */
/**@typedef {import('../model/points-model.js').default} PointsModel */
/**@typedef {import('../model/points-model.js').default} FilterModel */

/**
 * Презентер страницы.
 */
export default class PointsBoardPresenter {
  #pointsConstainer;

  #destinationsModel;
  #offersModel;
  #pointsModel;
  #filterModel;

  #pointsEmplyComponent;
  #sortsComponent;
  #pointsListComponent;

  /**@type{Map<string, PointPresenter>} */
  #pointPresenters = new Map();

  #currentSortType = SortTypes.DEFAULT;
  #filterType = FilterTypes.EVERYTHING;

  /**
   * Конструктор доски точек маршрута
   * @param {{points: PointsModel, destinationsModel: DestinationsModel, offersModel: OffersModel, pointsConstainer: HTMLElement, filterModel: FilterModel}} paramы
   */
  constructor({ destinationsModel, pointsModel, offersModel, pointsConstainer, filterModel }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#pointsListComponent = new PointsListView();


    this.#pointsConstainer = pointsConstainer;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filters[this.#filterType](points);


    return this.#getSortPoints(filteredPoints);
  }

  init() {
    if (this.points.length > 0) {
      this.#renderPointsBoard();

      return;
    }

    this.#renderEmplyPoints();
  }

  /**
   * Сортирует точки маршрута в зависимсоти от установленной сортировки
   * @param {Points} points
   * @returns {Points} Отсортированные точки маршрута
   */
  #getSortPoints(points) {
    switch (this.#currentSortType) {
      case SortTypes.DEFAULT:
        return sortPointsByDate(points);
      case SortTypes.TIME:
        return sortPointsByDuration(points);
      case SortTypes.PRICE:
        return sortPointsByPrice(points);
      case SortTypes.OFFERS:
        return sortPointsByOffersLength(points);
      default:
        return points;
    }
  }

  #renderEmplyPoints() {
    this.#pointsEmplyComponent = new PointsEmplyView({
      selectFilter: this.#filterType
    });

    render(this.#pointsEmplyComponent, this.#pointsConstainer, RenderPosition.BEFOREEND);
  }

  /**
   * Рендерит компонент сортировки событий.
   * @private
   */
  #renderSorts() {
    this.#sortsComponent = new PointsSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortsComponent, this.#pointsConstainer, RenderPosition.AFTERBEGIN);
  }

  /**
   * Рендерит компоненты для блока событий
   * @private
   */
  #renderPointsBoard() {
    this.#renderSorts();
    render(this.#pointsListComponent, this.#pointsConstainer, RenderPosition.BEFOREEND);

    this.points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        pointsListContainer: this.#pointsListComponent.element,
        destinationsModel: this.#destinationsModel,
        offersModel: this.#offersModel,
        onDataChanged: this.#handleViewAction,
        onModeChange: this.#handleModeChange
      });

      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  /**
   * Очищает презентеры событий.
   * @private
   */
  #clearPointsBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortsComponent);

    if (this.#pointsEmplyComponent) {
      remove(this.#pointsEmplyComponent);
    }


    if (resetSortType) {
      this.#currentSortType = SortTypes.DEFAULT;
    }
  }

  /**
  * Обработчик изменения данных события.
  * @param {PointObject} updatePoint - Обновленное событие.
  * @private
  */
  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsBoard();
        this.#renderPointsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsBoard({ resetSortType: true });
        this.init();
        break;
    }
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
    this.#clearPointsBoard();
    this.#renderPointsBoard();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}

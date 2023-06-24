//@ts-checks
import {
  FilterTypes,
  ShakeTimeLimit,
  SortTypes,
  UpdateType,
  UserAction,
} from '../constants';
import { remove, render, RenderPosition } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { filters } from '../utils/filters';
import { SortFunctions } from '../utils/points';
import LoadingView from '../view/loading-view';
import newPointButtonView from '../view/new-point-button-view';
import PointsEmplyView from '../view/points-empty-view';
import PointsListView from '../view/points-list-view';
import PointsSortView from '../view/points-sort-view';
import FiltersPresenter from './filters-presenter';
import NewPointPresenter from './new-point-presenter';
import PointPresenter from './point-presenter';
import TripInfoPresenter from './trip-info-presenter';

/**@typedef {import('../model/points-model').Point} Point */
/**@typedef {import('../model/points-model').Points}  Points*/
/**@typedef {import('../model/offers-model').default} OffersModel */
/**@typedef {import('../model/destinations-model').default} DestinationsModel */
/**@typedef {import('../model/points-model').default} DestinationsModel */
/**@typedef {import('../model/points-model').default} PointsModel */
/**@typedef {import('../model/filter-model').default} FilterModel */

/**
 * Презентер страницы.
 */
export default class BoardPresenter {
  #pageContainer;
  #headerContainer;
  #filterContiner;
  #pointsConstainer;

  #destinationsModel;
  #offersModel;
  #pointsModel;
  #filterModel;

  #pointsEmplyComponent;
  #sortsComponent;
  #newPointButtonComponent;

  #pointsListComponent = new PointsListView();
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit: ShakeTimeLimit.LOWER_LIMIT,
    upperLimit: ShakeTimeLimit.UPPER_LIMIT
  });

  /**@type{Map<string, PointPresenter>} */
  #tripInfoPresenter;
  #filtersPresenter;
  #pointPresenters = new Map();
  #newPointPresenter;

  #currentSortType = SortTypes.DEFAULT;
  #filterType = FilterTypes.EVERYTHING;
  #isLoading = true;

  /**
   * Конструктор доски точек маршрута
   * @param {{pointsModel: PointsModel, destinationsModel: DestinationsModel, offersModel: OffersModel, container: HTMLElement, filterModel: FilterModel, onNewTaskDestroy: function}} paramы
   */
  constructor({ destinationsModel, pointsModel, offersModel, container, filterModel }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#pageContainer = container;
    this.#headerContainer = this.#pageContainer.querySelector('.trip-main');
    this.#filterContiner = this.#headerContainer.querySelector('.trip-controls__filters');
    this.#pointsConstainer = this.#pageContainer.querySelector('.trip-events');

    this.#newPointPresenter = new NewPointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      handleDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose
    });
    this.#tripInfoPresenter = new TripInfoPresenter({
      container: this.#headerContainer,
      destinationsModel: destinationsModel,
      offersModel,
    });
    this.#filtersPresenter = new FiltersPresenter({
      pointsModel,
      filterModel,
      filtersContainer: this.#filterContiner
    });
    this.#newPointButtonComponent = new newPointButtonView({
      onClick: this.#handleNewPointButtonClick
    });

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

    render(this.#pointsListComponent, this.#pointsConstainer, RenderPosition.BEFOREEND);
    render(this.#newPointButtonComponent, this.#headerContainer, RenderPosition.BEFOREEND);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    if (points.length > 0) {
      this.#tripInfoPresenter.init(points);
      this.#renderPointsBoard(points);

      return;
    }

    this.#renderEmplyPoints();
  }

  createPoint() {
    this.#currentSortType = SortTypes.DEFAULT;
    this.#newPointPresenter.init({
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel
    });
  }

  /**
   * Сортирует точки маршрута в зависимсоти от установленной сортировки
   * @param {Points} points
   * @returns {Points} Отсортированные точки маршрута
   */
  #getSortPoints(points) {
    return SortFunctions[this.#currentSortType](points);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEmplyPoints() {
    this.#pointsEmplyComponent = new PointsEmplyView({ selectFilter: this.#filterType });

    render(this.#pointsEmplyComponent, this.#pointsListComponent.element, RenderPosition.BEFOREEND);
  }

  /**
   * Рендерит компонент сортировки событий.
   * @private
   */
  #renderSorts() {
    this.#sortsComponent = new PointsSortView({
      currentSortType: this.#currentSortType,
      handleSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortsComponent, this.#pointsConstainer, RenderPosition.AFTERBEGIN);
  }

  /**
   * Рендерит компоненты для блока событий
   */
  #renderPointsBoard(points) {
    this.#renderSorts();

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        pointsListContainer: this.#pointsListComponent.element,
        destinationsModel: this.#destinationsModel,
        offersModel: this.#offersModel,
        handleDataChanged: this.#handleViewAction,
        handleModeChange: this.#handleModeChange
      });

      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  /**
   * Очищает презентеры событий.
   * @private
   */
  #clearBoard({ resetSortType = false, resetTripInfo = false } = {}) {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();

    if (this.#sortsComponent) {
      remove(this.#sortsComponent);
    }

    if (this.#pointsEmplyComponent) {
      remove(this.#pointsEmplyComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortTypes.DEFAULT;
    }
    if (resetTripInfo) {
      this.#tripInfoPresenter.destroy();
    }

  }

  /**
  * Обработчик изменения данных события.
  * @param {Point} updatePoint - Обновленное событие.
  * @private
  */
  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (error) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;

    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard({ resetTripInfo: true });
        this.init();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true, resetTripInfo: true });
        this.init();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init();
        break;
    }
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    if (this.#pointsEmplyComponent) {
      remove(this.#pointsEmplyComponent);
    }

    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
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
    this.#clearBoard({ resetTripInfo: true });
    this.init();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}

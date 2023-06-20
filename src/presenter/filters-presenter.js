//@ts-check

import { FilterTypes, UpdateType } from '../constants.js';
import Observable from '../framework/observable.js';
import { remove, render, replace } from '../framework/render.js';
import { filters } from '../utils/filters.js';
import FilterView from '../view/filter-view.js';

/**
 * @typedef {import('../model/points-model.js').PointObject} PointObject
 * @typedef {import('../model/filter-model.js').default} FilterModel
 * @typedef {import('../model/points-model.js').default} PointsModel
*/

/** Пресентер фильтров*/
export default class FiltersPresenter extends Observable {
  #filtersContainer;
  #filterModel;
  #pointsModel;

  #filterComponent;

  /** @param {{pointsModel: PointsModel, FiltersContainer: HTMLElement, filterModel: FilterModel}} params*/
  constructor({ pointsModel, FiltersContainer, filterModel }) {
    super();
    this.#filtersContainer = FiltersContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;


    this.#pointsModel.addObserver(this.#handleModelPoint);
    this.#filterModel.addObserver(this.#handleModelPoint);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterTypes).map((type) => {
      const filteredPoints = filters[type](points);
      return { type, disabled: filteredPoints.length <= 0 };
    });
  }

  /**Метод для отрисовки фильтров */
  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelPoint = () => {
    this.init();
  };

  /** @param { string } filterType*/
  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

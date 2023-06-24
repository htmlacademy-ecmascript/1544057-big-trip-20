//@ts-check

import { FilterTypes, UpdateType } from '../constants';
import Observable from '../framework/observable';
import { remove, render, replace } from '../framework/render';
import { filterСonditions } from '../utils/filters';
import FilterView from '../view/filter-view';

/**
 * @typedef {import('../model/points-model').PointObject} PointObject
 * @typedef {import('../model/filter-model').default} FilterModel
 * @typedef {import('../model/points-model').default} PointsModel
*/

/** Пресентер фильтров*/
export default class FiltersPresenter extends Observable {
  #filtersContainer;

  #filterModel;
  #pointsModel;

  #filterComponent;

  /** @param {{pointsModel: PointsModel, filtersContainer: HTMLElement, filterModel: FilterModel}} params*/
  constructor({ pointsModel, filtersContainer, filterModel }) {
    super();
    this.#filtersContainer = filtersContainer;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;


    this.#pointsModel.addObserver(this.#handleModelPointChange);
    this.#filterModel.addObserver(this.#handleModelPointChange);
  }

  get filters() {
    const points = this.#pointsModel.points;

    const filtersConfig = {
      [FilterTypes.EVERYTHING]: true,
      [FilterTypes.FUTURE]: true,
      [FilterTypes.PRESENT]: true,
      [FilterTypes.PAST]: true
    };

    points.forEach((point) => {
      Object.values(FilterTypes).forEach((filterName) => {
        if (filterСonditions[filterName](point)) {
          filtersConfig[filterName] = false;
        }
      });
    });

    const filters = [];

    for (const filterName in filtersConfig) {
      const disabled = filtersConfig[filterName];

      filters.push({ filterName, disabled });
    }

    return filters;
  }

  /**Метод для отрисовки фильтров */
  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      handleFilterTypeChange: this.#handleFilterTypeChange
    });

    if (!prevFilterComponent) {
      render(this.#filterComponent, this.#filtersContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelPointChange = () => {
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

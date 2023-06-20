import AbstractView from '../framework/view/abstract-stateful-view';

/**
 * Функция создания фильтра
 * @param {String} filterName Название фильтра
 * @param {Boolean} checked параметр выбора по умолчанию
 * @param {Boolean} disabled параметр отключеиня фильтра
 * @returns
 */
const createFilter = ({ filterName, checked = false, disabled = false }) => `
<div class="trip-filters__filter">
  <input id="filter-${filterName.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName.toLowerCase()}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
  <label class="trip-filters__filter-label" for="filter-${filterName.toLowerCase()}">${filterName}</label>
</div>`;

/**
 *
 * @param {object} filters
 * @returns {HTMLElement}
 */
const createFilters = (filters, currentFilterType) => {
  const filtersTemplate = filters.map((filter) => {

    if (filter.type === currentFilterType) {
      return createFilter({ filterName: filter.type, checked: true, disabled: filter.disabled });
    }

    return createFilter({ filterName: filter.type, disabled: filter.disabled });
  });

  return filtersTemplate.join('\n');

};

const createPointsFilterTemplate = (filters, currentFilterType) => `
<form class="trip-filters" action="#" method="get">
    ${createFilters(filters, currentFilterType)}
    <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;

export default class FilterView extends AbstractView {
  #filters;
  #handleFilterTypeChange;
  #currentFilterType;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createPointsFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (event) => {
    event.preventDefault();
    this.#handleFilterTypeChange(event.target.value);
  };
}

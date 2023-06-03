import AbstractView from '../framework/view/abstract-stateful-view';

/**
 * Функция создания фильтра
 * @param {String} filterName Название фильтра
 * @param {Boolean} checked параметр выбора по умолчанию
 * @param {Boolean} disabled параметр отключеиня фильтра
 * @returns
 */
const createFilter = (filterName, checked = false, disabled = false) => `
<div class="trip-filters__filter">
  <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName.toLowerCase()}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
  <label class="trip-filters__filter-label" for="filter-${filterName.toLowerCase()}">${filterName}</label>
</div>`;

/**
 *
 * @param {object} filters
 * @returns {HTMLElement}
 */
const createFilters = (filters) => {
  const filtersTemplate = [];
  for (const filterName in filters) {
    if (Object.hasOwnProperty.call(filters, filterName)) {
      const filter = filters[filterName];
      filtersTemplate.push(createFilter(filterName, filter.checked, filter.disabled));
    }
  }
  return filtersTemplate.join('\n');

};

const createEventsFilterTemplate = (Filters) => `
<form class="trip-filters" action="#" method="get">
    ${createFilters(Filters)}
    <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;

export default class EventsFilterView extends AbstractView {
  #filters = null;
  constructor(Filters) {
    super();
    this.#filters = Filters;
  }

  get template() {
    return createEventsFilterTemplate(this.#filters);
  }
}

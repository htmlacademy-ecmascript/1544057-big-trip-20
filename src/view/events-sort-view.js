import { SortTypes } from '../constants';
import AbstractView from '../framework/view/abstract-stateful-view';

/**
 * @param {string} sortName
 * @param {boolean} [checked = false] checked
*/
const createSort = (sortName, checked = false) => `
<div class="trip-sort__item  trip-sort__item--${sortName}">
  <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName}" ${checked ? 'checked' : ''}>
  <label class="trip-sort__btn" for="sort-${sortName}">${sortName}</label>
</div>`;

const createSorts = (/** @type {SortTypes} */ types) => {
  const template = [];

  for (const type in types) {
    const sortTypeValue = types[type];
    if (type === 'DEFAULT') {
      template.push(createSort(sortTypeValue, true));
      continue;
    }
    template.push(createSort(sortTypeValue));
  }
  return template.join('\n');
};

/**
 * Создает шаблон сортировки событий.
 * @returns {string} HTML-разметка шаблона сортировки.
 */
const createEventsSortsTemplate = () => `
<form class="trip-events__trip-sort  trip-sort" method="get">
  ${createSorts(SortTypes)}
</form>`;

export default class EventsSortView extends AbstractView {
  /** @param {{onSortTypeChange: function}} params*/
  constructor({ onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #handleSortTypeChange;

  get template() {
    return createEventsSortsTemplate();
  }

  /**
 * Обработчик изменения типа сортировки.
 * @param {Event} event - Событие клика.
 * @private
 */
  #sortTypeChangeHandler = (event) => {
    if (event.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleSortTypeChange(event.target.value);
  };
}

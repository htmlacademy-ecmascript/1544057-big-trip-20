import { SortTypes } from '../constants';
import AbstractView from '../framework/view/abstract-stateful-view';

/**
 * @param {string} sortName
 * @param {boolean} [checked = false] checked
*/
const createSort = (sortName, checked = false, disabled = false) => `
<div class="trip-sort__item  trip-sort__item--${sortName}">
  <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
  <label class="trip-sort__btn" for="sort-${sortName}">${sortName}</label>
</div>`;


/**
 * @param {SortTypes} types
 * @param {string} currentSortType
 */
const createSorts = (types, currentSortType) => {
  const template = [];

  for (const type in types) {
    const sortTypeValue = types[type];
    if (sortTypeValue === currentSortType) {
      template.push(createSort(sortTypeValue, true));
      continue;
    }

    if (sortTypeValue === types.OFFERS || sortTypeValue === types.POINT) {
      template.push(createSort(sortTypeValue, false, true));
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
const createPointsSortsTemplate = (currentSortType) => `
<form class="trip-events__trip-sort  trip-sort" method="get">
  ${createSorts(SortTypes, currentSortType)}
</form>`;

export default class PointsSortView extends AbstractView {
  #currentSortType;
  #handleSortTypeChange;

  /** @param {{handleSortTypeChange: function}} params*/
  constructor({ handleSortTypeChange, currentSortType }) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = handleSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createPointsSortsTemplate(this.#currentSortType);
  }

  /**
 * Обработчик изменения типа сортировки.
 * @param {Event} point - Событие клика.
 * @private
 */
  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.#handleSortTypeChange(evt.target.value);
  };
}

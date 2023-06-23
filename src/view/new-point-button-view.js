//@ts-check
/**
 * @typedef {Object} NewPointButtonViewProps - Свойства компонента NewPointButtonView
 * @property {function} onClick - Обработчик клика по кнопке
 */

import AbstractView from '../framework/view/abstract-view.js';

/**
 * Создает HTML-шаблон кнопки "New event".
 * @returns {string} Строка с HTML-шаблоном кнопки
 */
function createTemplate() {
  return '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>';
}

/**
 * Компонент представления кнопки "New event".
 */
export default class NewPointButtonView extends AbstractView {
  /** @type {function} */
  #handleClick;

  /**
   * Создает экземпляр NewPointButtonView.
   * @param {NewPointButtonViewProps} props - Свойства компонента
   */
  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  /**
   * Возвращает HTML-шаблон компонента.
   * @returns {string} HTML-шаблон компонента
   */
  get template() {
    return createTemplate();
  }

  /**
   * Устанавливает кнопке состояние "disabled".
   */
  setDisable() {
    this.element.disabled = true;
  }

  /**
   * Устанавливает кнопке состояние "enabled".
   */
  setEnable() {
    this.element.disabled = false;
  }

  /**
   * Обработчик клика по кнопке.
   * @param {Event} evt - Объект события
   */
  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}

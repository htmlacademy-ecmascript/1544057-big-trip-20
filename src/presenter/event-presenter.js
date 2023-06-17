import { remove, render, replace } from '../framework/render.js';
import { checkEscKeydownPress } from '../utils/commons.js';
import EventFormView from '../view/event/event-form-view.js';
import EventInfoView from '../view/event/event-info-view.js';

/** Пересентер события */
/**@typedef {import('./page-presenter').EventObject}  EventObject*/
/**@typedef {import('../model/offers-model.js').Offer} Offer */
/**@typedef {import('../model/destinations-model.js').default}  DestinationsModel*/
/**@typedef {import('../model/offers-model.js').default}  OffersModel*/

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventsListContainer;
  #offersModel;
  #destinationsModel;
  /**@type{EventInfoView}*/
  #eventInfoComponent;
  /**@type{EventFormView}*/
  #eventFormComponent;
  #handleDataChange;
  #handleModeChange;
  /**@type{EventObject} */
  #event;
  #mode = Mode.DEFAULT;

  /**
   * @param {{eventsListContainer: HTMLElement, destinationsModel: DestinationsModel, offersModel: OffersModel, onDataChanged: function, onModeChange: function}} params
   */
  constructor({ eventsListContainer, destinationsModel, offersModel, onDataChanged, onModeChange }) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChanged;
    this.#handleModeChange = onModeChange;
  }

  /**
   * @param {EventObject} event
   */
  init(event) {
    this.#event = event;
    const prevInfoComponent = this.#eventInfoComponent;
    const prevFormComponent = this.#eventFormComponent;

    this.#eventInfoComponent = new EventInfoView({
      event: this.#event,
      destinations: this.#destinationsModel.destinations,
      offersByTypes: this.#offersModel.offers,
      onEditButtonClick: () => {
        this.#replaceEventToForm();
        document.addEventListener('keydown', this.#ecsKeydownHandler);
      },
      onFavoriteClick: () => this.#handleFavoriteClick()
    });

    this.#eventFormComponent = new EventFormView({
      event: this.#event,
      destinations: this.#destinationsModel.destinations,
      offersByTypes: this.#offersModel.offers,
      onCancelClick: this.#replaceFormToInfo,
      onSubmitClick: this.#handleFormSubmit
    });

    if (!prevInfoComponent || !prevFormComponent) {
      render(this.#eventInfoComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventInfoComponent, prevInfoComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventFormComponent, prevFormComponent);
    }

    remove(prevInfoComponent);
    remove(prevFormComponent);
  }

  /**
   * Сбрасывает карточку на режим просмотра
   */
  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToInfo();
    }
  };

  /**
   * Обработчик нажатия ESCAPE
   * @param {KeyboardEvent} event
   */
  #ecsKeydownHandler = (event) => {
    checkEscKeydownPress(event, () => {
      this.#eventFormComponent.resetState();
      this.#replaceFormToInfo();
    });
  };

  /**
   * Переводит карточку на режим редактирования
   */
  #replaceEventToForm = () => {
    replace(this.#eventFormComponent, this.#eventInfoComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  /**
   * Переводит карточку в режим просмотра
   */
  #replaceFormToInfo = () => {
    replace(this.#eventInfoComponent, this.#eventFormComponent);
    document.removeEventListener('keydown', this.#ecsKeydownHandler);
    this.#mode = Mode.DEFAULT;
  };

  /**
  * Удаляет компонент
  */
  destroy() {
    remove(this.#eventInfoComponent);
    remove(this.#eventFormComponent);
  }

  /**
   * Обработчик клика по кнопке добавить в избранное
   */
  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#event, isFavorite: !this.#event.isFavorite });
  };

  /**
   * Обработчик сохранения данных формы
   * @param {EventObject} event
   */
  #handleFormSubmit = (event) => {
    if (event.id.trim().length < 1) {
      throw new Error('Нету функции добавления нового события');
    }
    if (event.destination.trim().length < 1) {
      throw new Error('Нету точки назначения');
    }

    this.#replaceFormToInfo();

    this.#handleDataChange({ ...event });
  };

}

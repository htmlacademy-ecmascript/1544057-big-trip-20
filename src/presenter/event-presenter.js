import { remove, render, replace } from '../framework/render.js';
import { checkEcsKeydownPress } from '../utils/commons.js';
import EventFormView from '../view/event/event-form-view.js';
import EventInfoView from '../view/event/event-info-view.js';

/** Пересентер события */
/**@typedef {import('./page-presenter').EventObject}  EventObject*/
/**@typedef {import('../model/offers-model.js').Offer} Offer */
/**@typedef {import('../model/destinations-model.js').Destination} Destination */
/**@typedef {import('../model/destinations-model.js').default}  DestinationsModel*/
/**@typedef {import('../model/offers-model.js').default}  OffersModel*/
/**
 * @typedef ExtendedInfo
 * @type {object}
 * @property {Destination | undefined} destination
 * @property {Array<Offer|undefined>|undefined} offers
*/
/**
 * @typedef EventInfo
 * @type {Object}
 * @property {EventObject} event
 * @property {ExtendedInfo} extendedInfo
*/

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
      onButtonClick: () => {
        this.#replaceEventToForm();
        document.addEventListener('keydown', this.#ecsKeydownHandler);
      },
      onFavoriteClick: () => this.#handleFavoriteClick()
    });

    this.#eventFormComponent = new EventFormView({
      event: this.#event,
      destinations: this.#destinationsModel.destinations,
      offersByTypes: this.#offersModel.offers,
      onButtonClick: () => {
        this.#replaceFormToInfo();
      }
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

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToInfo();
    }
  }

  /** @param {KeyboardEvent} event*/
  #ecsKeydownHandler = (event) => checkEcsKeydownPress(event, this.#replaceFormToInfo);

  #replaceEventToForm = () => {
    replace(this.#eventFormComponent, this.#eventInfoComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToInfo = () => {
    replace(this.#eventInfoComponent, this.#eventFormComponent);
    document.removeEventListener('keydown', this.#ecsKeydownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#event, isFavorite: !this.#event.isFavorite });
  };

  /**
  * Удаляет компонент
  */
  destroy() {
    remove(this.#eventInfoComponent);
    remove(this.#eventFormComponent);
  }
}

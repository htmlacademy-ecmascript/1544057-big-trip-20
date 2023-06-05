//@ts-check
import { FormTypes } from '../constants.js';
import { remove, render, replace } from '../framework/render.js';
import { checkEcsKeydownPress } from '../utils/commons.js';
import EventFormView from '../view/event/event-form-view.js';
import EventInfoView from '../view/event/event-info-view.js';

/** Пересентер события */
export default class EventPresenter {
  #eventsListContainer;
  #destinations;
  /**@type{EventInfoView}*/
  #eventInfoComponent;
  /**@type{EventFormView}*/
  #eventFormComponent;

  /**
   * @param {{eventsListContainer: HTMLElement, destinations: Array<object>}} params
   */
  constructor({ eventsListContainer, destinations }) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinations = destinations;
  }

  /**@typedef {import('./page-presenter').EventInfo}  EventInfo*/
  /**
   * @param {EventInfo} eventInfo
   */
  init(eventInfo) {
    this.#eventInfoComponent = new EventInfoView({
      eventInfo: eventInfo, onButtonClick: () => {
        replaceEventToForm();
        document.addEventListener('keydown', ecsKeydownHandler);
      }
    });
    this.#eventFormComponent = new EventFormView({
      formType: FormTypes.EDIT_FORM, eventInfo: eventInfo, destinations: this.#destinations, onButtonClick: () => {
        replaceFormToEvent();
      }
    });

    const prevInfoComponent = this.#eventInfoComponent;
    const prevEditFormComponent = this.#eventFormComponent;

    if (!prevInfoComponent || !prevEditFormComponent) {
      render(this.#eventInfoComponent, this.#eventsListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#eventsListContainer.contains(prevInfoComponent.element)) {
      replace(this.#eventInfoComponent, prevInfoComponent);
    }

    if (this.#eventsListContainer.contains(prevEditFormComponent.element)) {
      replace(this.#eventFormComponent, prevEditFormComponent);
    }

    remove(prevInfoComponent);
    remove(prevEditFormComponent);


    /**
     * @param {KeyboardEvent} event
     */
    function ecsKeydownHandler(event) {
      checkEcsKeydownPress(event, replaceFormToEvent);
    }

    function replaceFormToEvent() {
      replace(this.#eventInfoComponent, this.#eventFormComponent);
      document.removeEventListener('keydown', ecsKeydownHandler);
    }

    function replaceEventToForm() {
      replace(this.#eventFormComponent, this.#eventInfoComponent);
    }
  }

  destroy() {
    remove(this.#eventInfoComponent);
    remove(this.#eventFormComponent);
  }
}

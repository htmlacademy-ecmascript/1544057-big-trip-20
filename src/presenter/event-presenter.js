//@ts-check
import { FormTypes } from '../constants.js';
import { render, RenderPosition, replace } from '../framework/render.js';
import { checkEcsKeydownPress } from '../utils/commons.js';
import EventFormView from '../view/event/event-form-view.js';
import EventInfoView from '../view/event/event-info-view.js';

/** Пересентер события */
export default class EventPresenter {
  #eventsListContainer;
  #destinations;

  /**
   * @param {{eventsListContainer: HTMLElement, destinations: Array<object>}} params
   */
  constructor({ eventsListContainer, destinations }) {
    this.#eventsListContainer = eventsListContainer;
    this.#destinations = destinations;
  }

  /**
   * @param {{ eventType: string; eventCityName: any; eventPrice: number; isFavorite: boolean; eventStartDate: string; eventEndDate: string; destination: any; offers: any[]; }} eventInfo
   */
  init(eventInfo) {
    const eventInfoComponent = new EventInfoView({
      eventInfo: eventInfo, onButtonClick: () => {
        replaceEventToForm();
        document.addEventListener('keydown', ecsKeydownHandler);
      }
    });
    const eventFormComponent = new EventFormView({
      formType: FormTypes.EDIT_FORM, eventInfo: eventInfo, destinations: this.#destinations, onButtonClick: () => {
        replaceFormToEvent();
      }
    });

    render(eventInfoComponent, this.#eventsListContainer, RenderPosition.BEFOREEND);


    function ecsKeydownHandler(event) {
      checkEcsKeydownPress(event, replaceFormToEvent);
    }

    function replaceFormToEvent() {
      replace(eventInfoComponent, eventFormComponent);
      document.removeEventListener('keydown', ecsKeydownHandler);
    }

    function replaceEventToForm() {
      replace(eventFormComponent, eventInfoComponent);
    }
  }
}

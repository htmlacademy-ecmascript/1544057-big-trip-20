import { createElement } from '../../../../render.js';

const createEventFormDetailsTemplate = () => '<section class="event__details"></section>';

export default class EventFormDetailsView {
  getTemplate() {
    return createEventFormDetailsTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

import { createElement } from '../../render.js';

const createEventFormTemplate = () => '<form class="event event--edit" action="#" method="post"></form>';

export default class EventFormView {
  getTemplate() {
    return createEventFormTemplate();
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

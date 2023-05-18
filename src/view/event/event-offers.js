import { createElement } from '../../render.js';

const createEventOfferTemplate = ({ price, title }) => `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`;


export default class EventOfferView {
  constructor(eventOffer) {
    this.eventOffer = eventOffer;
  }

  getTemplate() {
    return createEventOfferTemplate(this.eventOffer);
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

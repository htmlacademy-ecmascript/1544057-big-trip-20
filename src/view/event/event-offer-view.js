import AbstractView from '../../framework/view/abstract-stateful-view';

const createEventOfferTemplate = ({ price, title }) => `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`;

export default class EventOffersView extends AbstractView {
  #eventOffer = null;

  constructor(eventOffer) {
    super();
    this.#eventOffer = eventOffer;
  }

  get template() {
    return createEventOfferTemplate(this.#eventOffer);
  }
}

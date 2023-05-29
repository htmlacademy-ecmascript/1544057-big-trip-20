import AbstractView from '../../../../framework/view/abstract-stateful-view';

const createOffer = (offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage">
        <label class="event__offer-label" for="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
`;

const createEventFormOffersTemplate = (offers) => `
<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map((offer) => createOffer(offer)).join('\n')}
    </div>
</section>`;

export default class EventFormOffersView extends AbstractView {
  #offers = null;

  constructor(offers) {
    super();
    this.offers = offers;
  }

  get template() {
    return createEventFormOffersTemplate(this.offers);
  }
}

import { EVENT_INFO_FORMAT, RENDER_DATE_FORMAT } from '../../constants';
import AbstractView from '../../framework/view/abstract-view';
import { calculateDuration, humanizeDate } from '../../utils/events';

/**
 * @typedef {import('../../presenter/event-presenter').EventInfo} EventInfo
 * @typedef {import('../../presenter/page-presenter').EventObject} EventObject
 * @typedef {import('../../model/offers-model').Offer} Offer
 * @typedef {import('../../presenter/event-presenter').Destination} Destination
 * /

/**
 * @typedef ExtendedEvent
 * @type {object}
 * @property {object}
 */

/**
 * Создает шашлон выбранного предложения
 * @param {{title: string, price: number}} params
 * @returns {HTMLElement} Element
 */
const createOffer = ({ title, price }) => `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`;

/**
 * Создает шаблон всех выбранных предложений
 * @param {Array<Offer>} offers
 * @returns {HTMLElement} Element
 */
const renderOffers = (offers) => offers.map((offer) => createOffer(offer)).join('\n');

/**
 *
 * @param {EventInfo} params
 * @returns
 */
const createEventInfoTemplate = ({ offers, destination, type, dateFrom, dateTo, basePrice, isFavorite }) => `
<li class="trip-events__item">
  <div class="event">
  <time class="event__date" datetime = "${dateFrom}" > ${humanizeDate(dateFrom, RENDER_DATE_FORMAT)}</time >
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${destination.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFrom}" > ${humanizeDate(dateFrom, EVENT_INFO_FORMAT)}</time>
      &mdash;
      <time class="event__end-time" datetime="${dateTo}" > ${humanizeDate(dateTo, EVENT_INFO_FORMAT)}</time>
    </p>
    <p class="event__duration">${calculateDuration(dateFrom, dateTo)}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${renderOffers(offers)}
  </ul>
  <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
    </svg>
  </button>
  <button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>
</div >
</li>
`;

export default class EventInfoView extends AbstractView {
  #event;
  #destinations;
  #offersByTypes;
  #handlerEditClick;
  #handleFavoriteClick;

  /**
   * @param {{event: EventInfo, destinations: Array<Destination>, offersByType:  onButtonClick: function, onFavoriteClick: function}} params
   */
  constructor({ event, destinations, offersByTypes, onButtonClick, onFavoriteClick }) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#offersByTypes = offersByTypes;
    this.#handlerEditClick = onButtonClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn ').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventInfoTemplate(this.#parseEvent(this.#event));
  }

  /**
   * Parses an event object and extracts the relevant information.
   *
   * @param {EventInfo} event - The event object containing extended event information.
   * @returns {Object} - The parsed event object with destination and offers properties.
   */
  #parseEvent(event) {
    const offersByType = this.#offersByTypes.get(event.type);
    const offers = event.offers.map((offerId) => {
      const result = offersByType.find((offer) => offer.id === offerId);
      return result ? result : null;
    });

    return {
      ...event,
      offers: offers.filter(Boolean),
      destination: this.#destinations.get(event.destination),
    };
  }

  /**
 * @param {Event} event
 */
  #editClickHandler = (event) => {
    event.preventDefault();
    this.#handlerEditClick();
  };

  /**
 * @param {Event} event
 */
  #favoriteClickHandler = (event) => {
    event.preventDefault();
    this.#handleFavoriteClick();
  };
}

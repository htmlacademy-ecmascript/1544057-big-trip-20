//@ts-check
import { POINT_INFO_FORMAT, RENDER_DATE_FORMAT } from '../../constants';
import AbstractView from '../../framework/view/abstract-view';
import { calculateDuration, humanizeDate } from '../../utils/points';

/**
 * @typedef {import('../../presenter/page-presenter').Point} Point
 * @typedef {import('../../model/offers-model').OffersByType} OffersByType
 * @typedef {import('../../model/destinations-model').Destinations} Destinations
 * /

/**
 * Создает шашлон выбранного предложения
 * @param {{title: string, price: number}} params
 * @returns {string} Element
 */
const createOffer = ({ title, price }) => `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`;

/**
 * Создает шаблон всех выбранных предложений
 * @param {Array<Offer>} offers
 * @returns {string} Element
 */
const renderOffers = (offers) => offers.map((offer) => createOffer(offer)).join('\n');

/**
 *
 * @param {Point} params
 * @returns
 */
const createPointInfoTemplate = ({ offers, destination, type, dateFrom, dateTo, basePrice, isFavorite }) => `
<li class="trip-events__item">
  <div class="event">
  <time class="event__date" datetime = "${dateFrom}" > ${humanizeDate(dateFrom, RENDER_DATE_FORMAT)}</time >
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${destination.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFrom}" > ${humanizeDate(dateFrom, POINT_INFO_FORMAT)}</time>
      &mdash;
      <time class="event__end-time" datetime="${dateTo}" > ${humanizeDate(dateTo, POINT_INFO_FORMAT)}</time>
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

export default class PointInfoView extends AbstractView {
  #point;
  #destinations;
  #offersByType;
  #handlerEditClick;
  #handleFavoriteClick;

  /**
   * @param {{point: Point, destinations: Destinations, offersByType: OffersByType,  onEditButtonClick: function, onFavoriteClick: function}} params
   */
  constructor({ point, destinations, offersByType, onEditButtonClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#handlerEditClick = onEditButtonClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn ').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointInfoTemplate(this.#parsePoint(this.#point));
  }

  /**
   * Parses an point object and extracts the relevant information.
   *
   * @param {Point} point - The point object containing extended point information.
   * @returns {Point} - The parsed point object with destination and offers properties.
   */
  #parsePoint(point) {
    const offersByType = this.#offersByType.get(point.type) || new Map();
    const offers = point.offers.map((offerId) => offersByType.get((offerId)) || null);

    return {
      ...point,
      offers: offers.filter(Boolean),
      destination: this.#destinations.get(point.destination),
    };
  }

  /**
 * @param {Event} evt
 */
  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handlerEditClick();
  };

  /**
 * @param {Event} evt
 */
  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}

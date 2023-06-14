//@ts-check
import { EVENT_FORM_FORMAT, FormTypes } from '../../constants.js';
import AbstractStatefulView
  from '../../framework/view/abstract-stateful-view.js';
import { EVENT_TYPES } from '../../mock/constants-mock.js';
import { getRandomInteger } from '../../utils/commons.js';
import { humanizeDate } from '../../utils/events.js';

/**
 * @typedef {import('../../model/offers-model.js').Offer} Offer
 * @typedef {import('../../model/destinations-model.js').Destination} Destination
 * @typedef {import('../../model/events-model.js').EventObject} EventObject
 * @typedef {import('../../presenter/event-presenter.js').EventInfo} EventInfo
 * @typedef {import('../../presenter/event-presenter.js').ExtendedInfo} ExtendedInfo
*/

/**
 * BlankEventInfo
 */
const BLANK_EVENT_INFO = {
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: EVENT_TYPES[0]
};

const createEditButtonTemplate = () => `
  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Delete</button>
  <button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
  </button>
`;

const createAddButtonTemplate = () => `
  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Cancel</button>
`;

/**
 *
 * @param {string} formType
 * @returns {string}
 */
const createButton = (formType) => formType === FormTypes.ADD_FORM ? createAddButtonTemplate() : createEditButtonTemplate();

/**
 * @param {string} photoSrc Путь к фотографии
 * @returns {string}
 */
const createPhoto = (photoSrc) => `<img class="event__photo" src="${photoSrc}" alt="Event photo">`;

const createPhotos = () => {
  const photosLength = getRandomInteger(1, 5);
  const photos = [];

  for (let i = 1; i <= photosLength; i++) {
    photos.push(createPhoto(`img/photos/${i}.jpg`));
  }
  return photos.join('\n');
};

/**
 * @param {Offer} offer
 * @param {boolean} checked
 * @returns {string}
 */
const createOffer = (offer, checked = false) => `
<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${checked ? 'checked' : ''}>
  <label class="event__offer-label" for="${offer.id}">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`;

/**
 *
 * @param {Array<Offer>} offers Выбранные предложения
 * @param {Array<Offer>} offersByTypes Все предложения
 * @returns {string}
 */
const createOffers = (offers, offersByTypes) => {
  const offerTemplates = offersByTypes.map((offer) => {
    if (offers.includes(offer)) {
      return createOffer(offer, true);
    }
    return createOffer(offer);
  });

  const offersTemplate = `
  <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offerTemplates.join('\n')}
      </div>
  </section>`;

  return offersTemplate;
};

/**
 *
 * @param {string} type
 * @param {Object} eventDestination
 * @param {Map} destinations
 * @returns {string}
 */
const createDestinationsSelect = (type, eventDestination, destinations) => {
  const destinationSlelectTemplates = [];

  destinations.forEach((destination) => destinationSlelectTemplates.push(`<option value="${destination.name}"></option>`));

  const dedtinationSelectTemplate = `
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventDestination.name}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${destinationSlelectTemplates.join('\n')}
    </datalist>
  </div>`;

  return dedtinationSelectTemplate;
};

/**
 * Создает шаблон описания места назначения
 * @param {Destination} destination
 * @returns {string}
 */
const createDestination = (destination) => {
  const destinationsTemplate = `<section class="event__section  event__section--destination" >
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${createPhotos()}
          </div>
        </div>
      </section > `;

  return destinationsTemplate;
};

/**
 *
 * @param {string} type
 * @param {Boolean} checked
 * @returns
 */
const createEventType = (type, checked = false) => {
  const LowerCaseType = type.toLowerCase();
  const labelText = type.charAt(0).toUpperCase() + type.slice(1);
  return `
  <div class="event__type-item" >
    <input id="event-type-${LowerCaseType}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${LowerCaseType}" ${checked ? ' checked' : ''}>
      <label class="event__type-label event__type-label--${LowerCaseType}" for="event-type-${LowerCaseType}-1">${labelText}</label>
    </div>
`;
};

/**
 * @param {Array<string>} types
 * @returns {String}
 */
const createEventTypesSelect = (selectType, types) => {
  const typeTemplates = [];

  for (const type of types) {
    if (type === selectType) {
      typeTemplates.push(createEventType(type, true));
      continue;
    }
    typeTemplates.push(createEventType(type));
  }

  const typesSelectTemplate = `
  <div class="event__type-list" >
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${typeTemplates.join('\n')}
    </fieldset>
  </div > `;
  return typesSelectTemplate;
};

const createEventTypes = (selectType, types) => {
  const eventTypesTemplate = `<div class="event__type-wrapper" >
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${selectType}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        ${createEventTypesSelect(selectType, types)}
      </div>`;
  return eventTypesTemplate;
};

/**
 * @param { Object } info object
 * @returns {string} Event template
 */
const createEventFormTemplate = ({ formType, offers, type, dateFrom, dateTo, basePrice, destination, destinations, offersByTypes }) => `
<li class="trip-events__item" >
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      ${createEventTypes(type, EVENT_TYPES)}
      ${createDestinationsSelect(type, destination, destinations)}

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, EVENT_FORM_FORMAT)}">
          &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, EVENT_FORM_FORMAT)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      ${createButton(formType)}
    </header>

    <section class="event__details">
      ${createOffers(offers, offersByTypes.get(type))}
      ${createDestination(destination)}
    </section>
  </form>
</li>`;


/** Класс представления формы изменения или добавления точки путешесвия
       * @class EventFormView
      */
export default class EventFormView extends AbstractStatefulView {
  #event;
  #offersByTypes;
  #destinations;
  #handlerEditClick;

  constructor({ event = BLANK_EVENT_INFO, destinations, offersByTypes, onButtonClick }) {
    super();
    this.#destinations = destinations;
    this.#offersByTypes = offersByTypes;
    this.#event = event;
    this.#handlerEditClick = onButtonClick;

    this.element.querySelector('.event__save-btn ').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventFormTemplate({ ...EventFormView.pareseEventToState(this.#event, this.#offersByTypes, this.#destinations), destinations: this.#destinations, offersByTypes: this.#offersByTypes });
  }

  /**
   * @param {EventObject} event
   * @param {Map} offersByTypes
   * @returns
   */
  static pareseEventToState(event, offersByTypes, destinations) {
    const offersByType = offersByTypes.get(event.type);
    const offers = event.offers.map((offerId) => {
      const result = offersByType.find((offer) => offer.id === offerId);
      return result ? result : null;
    });

    return {
      ...event,
      destination: destinations.get(event.destination),
      offers: offers
    };
  }

  static pareseStateToEvent(state) {
    const event = {
      ...state
    };

  }

  /**@param {Event} event*/
  #editClickHandler = (event) => {
    event.preventDefault();
    this.#handlerEditClick();
  };
}

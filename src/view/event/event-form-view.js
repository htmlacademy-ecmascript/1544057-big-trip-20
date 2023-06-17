//@ts-check
import { EVENT_FORM_FORMAT } from '../../constants.js';
import AbstractStatefulView
  from '../../framework/view/abstract-stateful-view.js';
import { findItemById, updateItem } from '../../utils/commons.js';
import { humanizeDate } from '../../utils/events.js';

/**
 * @typedef {import('../../model/offers-model.js').Offer} Offer
 * @typedef {import('../../model/offers-model.js').OffersByType} OffersByType
 * @typedef {import('../../model/destinations-model.js').Destinations} Destinations
 * @typedef { import('../../model/events-model.js').EventObject } EventObject
 * @typedef { import('./event-info-view.js').Destination } Destination
 */

/**
 * @typedef State
 * @type { object } State
 * @property { ?string } id
 * @property { string } type
 * @property { boolean } isEditForm
 * @property { boolean } isFavorite
 * @property { ?number } basePrice
 * @property { ?string } dateFrom
 * @property { ?string } dateTo
 * @property { Destination | false } destination
 * @property { Array<Offer>|array} offers
 * @property { Array<string>} availableTypes
 */

const BLANK_EVENT = {
  id: null,
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: null,
  type: null
};

/**
 * Создает кнопки для опеределенной формы
 * @param {boolean} isEditForm
 * @returns {string} Возвращает шаблон кнопок под вид формы
 */
function createButton(isEditForm) {
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

  return isEditForm ? createEditButtonTemplate() : createAddButtonTemplate();
}

/**
 *
 * @param {Array<Object>} offersByTypes Все предложения
 * @returns {string}
 */
function createOffersSection(offersByTypes) {
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

  const getOffersTemplate = () => offersByTypes.map((offer) => {
    if (offer.selected) {
      return createOffer(offer, true);
    }
    return createOffer(offer);
  }).join('\n');

  return offersByTypes ? `<section class="event__section  event__section--offers">
                              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                              <div class="event__available-offers">
                                ${getOffersTemplate()}
                              </div>
                          </section>` : '';
}

/**
 *
 * @param {string} type
 * @param {Object} eventDestination
 * @param {Map} destinations
 * @returns {string}
 */
function createDestinationsSelect(type, eventDestination, destinations) {
  const destinationSlelectTemplates = [];
  const cityName = eventDestination ? eventDestination.name : ' ';

  destinations.forEach((destination) => {
    destinationSlelectTemplates.push(`<option value="${destination.name}"></option>`);
  });

  const dedtinationSelectTemplate = `
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${cityName}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${destinationSlelectTemplates.join('\n')}
    </datalist>
  </div>`;

  return dedtinationSelectTemplate;
}

/**
 * Создает шаблон описания места назначения
 * @param {Destination | string} destination
 * @returns {string}
 */
function createDestinationSection(destination) {
  /**
 * @param {string} photoSrc Путь к фотографии
 * @returns {string}
 */
  const createPhoto = (photoSrc, description) => `<img class="event__photo" src="${photoSrc}" alt="${description}">`;

  const createPhotos = () => {
    const photos = destination.pictures.map((photo) => createPhoto(photo.src, photo.description));

    return photos.join('\n');
  };

  const getdestinationsTemplate = () => `<section class="event__section  event__section--destination" >
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${createPhotos()}
          </div>
        </div>
      </section > `;

  return destination?.description ? getdestinationsTemplate() : '';
}

/**
 * @param {string} selectType
 * @param {Array<string>} types
 * @returns {String}
 */
function createEventTypes(selectType, types) {
  /**
   * @param {string} type
   * @param {Boolean} checked
   * @returns
   */
  function createEventType(type, checked = false) {
    const LowerCaseType = type.toLowerCase();
    const labelText = type.charAt(0).toUpperCase() + type.slice(1);
    return `
  <div class="event__type-item" >
    <input id="event-type-${LowerCaseType}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${LowerCaseType}" ${checked ? ' checked' : ''}>
      <label class="event__type-label event__type-label--${LowerCaseType}" for="event-type-${LowerCaseType}-1">${labelText}</label>
    </div>
`;
  }

  /**
   * @returns {String}
   */
  function createEventTypesSelect() {
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
    </div >`;
    return typesSelectTemplate;
  }

  const eventTypesTemplate = `
    <div class="event__type-wrapper" >
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${selectType}.png" alt="Event type icon">
      </label>

      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
      ${createEventTypesSelect()}
    </div>`;

  return eventTypesTemplate;
}

/**
 * @param { Object } info object
 * @returns {string} Event template
 */
const createEventFormTemplate = ({ isEditForm, offers, type, availableTypes, dateFrom, dateTo, basePrice, destination, destinations }) => {
  const eventTypesTemplate = createEventTypes(type, availableTypes);
  const destinationsSelectTemplate = createDestinationsSelect(type, destination, destinations);
  const buttonsTemplate = createButton(isEditForm);
  const startTime = humanizeDate(dateFrom, EVENT_FORM_FORMAT);
  const endTime = humanizeDate(dateTo, EVENT_FORM_FORMAT);
  const offersSectionTemplate = createOffersSection(offers);
  const destinationSectionTemplate = createDestinationSection(destination);
  const eventPrice = basePrice ? basePrice : '';

  return `
<li class="trip-events__item" >
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      ${eventTypesTemplate}
      ${destinationsSelectTemplate}

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
          &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventPrice}">
      </div>

      ${buttonsTemplate}
    </header>

    <section class="event__details">
      ${offersSectionTemplate}
      ${destinationSectionTemplate}
    </section>
  </form>
</li>`;
};


/** Класс представления формы изменения или добавления точки путешесвия
         * @class EventFormView
        */
export default class EventFormView extends AbstractStatefulView {
  #event;
  #destinations;
  #offersByTypes;
  #handlerCancelClick;
  #handlerSubmitClick;
  #destinationsByCities;

  /**
   * Конструктор компонента формы события
   * @param {{event: EventObject | BLANK_EVENT, destinations: Destinations, offersByTypes: OffersByType, onCancelClick: function, onSubmitClick: function}} params
   */
  constructor({ event = BLANK_EVENT, destinations, offersByTypes, onCancelClick, onSubmitClick }) {
    super();
    this.#event = event;
    this.#destinations = destinations;
    this.#destinationsByCities = new Map();
    this.#offersByTypes = offersByTypes;
    this._setState(EventFormView.parseEventToState(this.#event, this.#offersByTypes, this.#destinations));
    this.#handlerCancelClick = onCancelClick;
    this.#handlerSubmitClick = onSubmitClick;

    [...this.#destinations.values()].forEach((destination) => this.#destinationsByCities.set(destination.name, { ...destination }));

    this._restoreHandlers();
  }


  get template() {
    return createEventFormTemplate({ ...this._state, destinations: this.#destinations });
  }

  resetState = () => {
    const prevState = EventFormView.parseEventToState(this.#event, this.#offersByTypes, this.#destinations);
    this.updateElement({ ...prevState });
  };

  _restoreHandlers() {
    const buttons = this.element.querySelectorAll('button');
    buttons.forEach((button) => button.addEventListener('click', this.#buttosClickHandler));

    const inputs = this.element.querySelectorAll('input');
    inputs.forEach((field) => field.addEventListener('change', this.#inputsChangeHandler));

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);
  }

  /** Проверяет корректность заполенния поллей */
  #isSubmitDisabled() {
    return !this._state.destination || !this._state.basePrice;
  }

  /**Обратывает отмену сохранения*/
  #cancelSaveClickHandler() {
    this.resetState();
    this.#handlerCancelClick();
  }

  /**@param {Event} event*/
  #buttosClickHandler = (event) => {
    event.preventDefault();
    switch (event.target.className) {
      case 'event__reset-btn':
        this.#cancelSaveClickHandler();
        break;
      case 'event__save-btn  btn  btn--blue':
        this.#handlerSubmitClick(EventFormView.parseStateToEvent(this._state));
        break;
      case 'event__rollup-btn':
        this.#cancelSaveClickHandler();
        break;
      default:
    }
  };

  /**@param {Event} event*/
  #inputsChangeHandler = (event) => {
    const saveButton = this.element.querySelector('.event__save-btn');
    const fileldType = event.target.className.split('--')[1] || event.target.className;

    /**
     * Обновляет basePrice
     * @param {?EventTarget} target
     */
    const updateBasePrice = (target) => {

      target.value = target.value.replace(/\D+/g, '');

      const basePrice = Number(target.value);
      if (basePrice) {
        target.value = basePrice;
        this._setState({ ...this._state, basePrice });
        return;
      }

      this._setState({ ...this._state, basePrice: false });
    };

    /**
     * Обновляет определенный offer
     * @param {Object} offer id
     */
    const updateOfferSelect = ({ id }) => {
      const findOffer = findItemById(this._state.offers, id);
      const newOffer = { ...findOffer, selected: !findOffer.selected };

      this._setState({ ...this._state, offers: updateItem(this._state.offers, newOffer) });

    };

    const updateDectination = (target) => {
      target.value = target.value.trim();
      const destination = this.#destinationsByCities.get(target.value) || false;
      if (destination) {
        this.updateElement({ ...this._state, destination });
        return;
      }
      target.value = ' ';
      this._setState({ ...this._state, destination: false });
    };

    event.preventDefault();


    switch (fileldType) {
      case 'destination':
        updateDectination(event.target);
        break;
      case 'time':
        break;
      case 'price':
        updateBasePrice(event.target);
        break;
      case 'event__offer-checkbox  visually-hidden':
        updateOfferSelect(event.target);
        break;
      default:
    }

    saveButton.disabled = this.#isSubmitDisabled();
  };

  /**@param {Event} event*/
  #typeChangeHandler = (event) => {
    const value = event.target.value;
    const type = value.charAt(0).toUpperCase() + value.slice(1);
    const offers = this.#offersByTypes.get(type);
    this.updateElement({ ...this._state, type, offers });
  };

  /**
   * @param {EventObject | BLANK_EVENT} event
   * @param {OffersByType} offersByTypes
   * @param {Destinations} destinations
   * @returns {State}
   */
  static parseEventToState(event, offersByTypes, destinations) {
    const availableTypes = Array.from(offersByTypes.keys());

    const evenType = event.type || availableTypes[0];
    const eventOffers = event.offers || [];

    const offersByType = offersByTypes.get(evenType) || [];

    const offers = offersByType.map((/** @type {Offer} */ offer) => ({
      ...offer,
      selected: eventOffers.includes(offer.id)
    }));

    return {
      ...event,
      type: evenType,
      isEditForm: !!event.id,
      destination: event.destination ? destinations.get(event.destination) : false,
      offers: offers,
      availableTypes
    };
  }

  /**
   * @param {State} state
   * @returns {EventObject}
   */
  static parseStateToEvent(state) {
    const {
      id,
      basePrice,
      dateFrom,
      dateTo,
      destination,
      isFavorite,
      offers,
      type
    } = state;

    const eventOffers = offers ? offers.filter((offer) => offer.selected).map((offer) => offer.id) : [];

    const event = {
      id: id ? id : '',
      basePrice: basePrice || 0,
      dateFrom: dateFrom || '',
      dateTo: dateTo || '',
      destination: destination ? destination.id : '',
      isFavorite,
      offers: eventOffers,
      type: type || ''
    };

    return event;
  }
}



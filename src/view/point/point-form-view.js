//@ts-check
import 'flatpickr/dist/flatpickr.min.css';

import flatpickr from 'flatpickr';

//@ts-check
import { POINT_FORM_FORMAT } from '../../constants.js';
import AbstractStatefulView
  from '../../framework/view/abstract-stateful-view.js';
import { humanizeDate } from '../../utils/points.js';

/**
 * @typedef {import('../../model/offers-model.js').Offer} Offer
 * @typedef {import('../../model/offers-model.js').OffersByType} OffersByType
 * @typedef {import('../../model/destinations-model.js').Destinations} Destinations
 * @typedef { import('../../model/points-model.js').PointObject } PointObject
 * @typedef { import('./point-info-view.js').Destination } Destination
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
 * @property { Map<string, Offer & {selected: boolean}>} offers
 * @property { Array<string>} availableTypes
 */

const BLANK_POINT = {
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
 * @param {Map<string, Offer & {selected: boolean}>} offersByTypes Все предложения
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

  const getOffersTemplate = () => Array.from(offersByTypes.values()).map((offer) => {
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
 * @param {Object} pointDestination
 * @param {Map} destinations
 * @returns {string}
 */
function createDestinationsSelect(type, pointDestination, destinations) {
  const destinationSlelectTemplates = [];
  const cityName = pointDestination ? pointDestination.name : ' ';

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
function createPointTypes(selectType, types) {
  /**
   * @param {string} type
   * @param {Boolean} checked
   * @returns
   */
  function createPointType(type, checked = false) {
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
  function createPointTypesSelect() {
    const typeTemplates = [];

    for (const type of types) {
      if (type === selectType) {
        typeTemplates.push(createPointType(type, true));
        continue;
      }
      typeTemplates.push(createPointType(type));
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

  const pointTypesTemplate = `
    <div class="event__type-wrapper" >
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${selectType}.png" alt="Event type icon">
      </label>

      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
      ${createPointTypesSelect()}
    </div>`;

  return pointTypesTemplate;
}

/**
 * @param { Object } info object
 * @returns {string} Point template
 */
const createPointFormTemplate = ({ isEditForm, offers, type, availableTypes, dateFrom, dateTo, basePrice, destination, destinations }) => {
  const pointTypesTemplate = createPointTypes(type, availableTypes);
  const destinationsSelectTemplate = createDestinationsSelect(type, destination, destinations);
  const buttonsTemplate = createButton(isEditForm);
  const startTime = humanizeDate(dateFrom, POINT_FORM_FORMAT);
  const endTime = humanizeDate(dateTo, POINT_FORM_FORMAT);
  const offersSectionTemplate = createOffersSection(offers);
  const destinationSectionTemplate = createDestinationSection(destination);
  const pointPrice = basePrice ? basePrice : '';

  return `<li class="trip-events__item" >
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                ${pointTypesTemplate}
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
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${pointPrice}">
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


/**
 * Класс представления формы изменения или добавления точки путешесвия
 * @class PointFormView
 */
export default class PointFormView extends AbstractStatefulView {
  #destinations;
  #offersByTypes;
  #handlerCancelClick;
  #handlerSubmitClick;
  #handlerDeleteClick;
  #destinationsByCities;
  #dateToPicker;
  #dateFromPicker;

  /**
   * Конструктор компонента формы события
   * @param {{point: PointObject | BLANK_POINT, destinations: Destinations, offersByTypes: OffersByType, onCancelClick: function, onSubmitClick: function}} params
   */
  constructor({ point = BLANK_POINT, destinations, offersByTypes, onCancelClick, onDeleteClick, onSubmitClick }) {
    super();
    this.#destinations = destinations;
    this.#offersByTypes = offersByTypes;

    this._setState(PointFormView.parsePointToState(point, this.#offersByTypes, this.#destinations));

    this.#handlerCancelClick = onCancelClick;
    this.#handlerSubmitClick = onSubmitClick;
    this.#handlerDeleteClick = onDeleteClick;


    this.#destinationsByCities = new Map();
    this.#destinations.forEach((destination) => this.#destinationsByCities.set(destination.name, destination));

    this._restoreHandlers();
  }

  get template() {
    return createPointFormTemplate({ ...this._state, destinations: this.#destinations });
  }

  /**
   * Сбрасывает состояние на изначальное
   * @param {PointObject} point
   */
  reset = (point) => {
    const prevState = PointFormView.parsePointToState(point, this.#offersByTypes, this.#destinations);
    this.updateElement({ ...prevState });
  };

  removeElement() {
    super.removeElement();

    if (this.#dateToPicker || this.#dateFromPicker) {
      this.#dateToPicker?.destroy();
      this.#dateFromPicker?.destroy();
      this.#dateToPicker = undefined;
      this.#dateFromPicker = undefined;
    }
  }

  _restoreHandlers() {
    const buttons = this.element.querySelectorAll('button');
    buttons.forEach((button) => button.addEventListener('click', this.#buttosClickHandler));

    const inputs = this.element.querySelectorAll('input');
    inputs.forEach((field) => field.addEventListener('change', this.#inputsChangeHandler));

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.#setDatepicker();
  }

  /** Проверяет корректность заполенния полей */
  #isSubmitDisabled() {
    return !this._state.destination ||
      !this._state.basePrice ||
      !this._state.dateFrom ||
      !this._state.dateTo;
  }

  #setDatepicker = () => {
    const [dateFrom, dateTo] = this.element.querySelectorAll('.event__input--time');
    this.#dateToPicker = flatpickr(
      dateFrom,
      {
        dateFormat: 'Y-m-dTH:i',
        altInput: true,
        altFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.dateTo,
        'time_24hr': true,
        locale: {
          firstDayOfWeek: 1
        }
      }
    );
    this.#dateFromPicker = flatpickr(
      dateTo,
      {
        dateFormat: 'Y-m-dTH:i',
        altInput: true,
        altFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.dateFrom,
        'time_24hr': true,
        locale: {
          firstDayOfWeek: 1
        }
      }
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
  };

  /**Обратывает отмену сохранения*/
  #cancelSaveClickHandler() {
    this.#handlerCancelClick();
  }

  /**
 * Обработчик всех кнопок
 * @param {Event} event
 */
  #buttosClickHandler = (event) => {
    event.preventDefault();
    switch (event.target.className) {
      case 'event__reset-btn':
        this.#handlerDeleteClick(PointFormView.parseStateToPoint(this._state));
        break;
      case 'event__save-btn  btn  btn--blue':
        this.#handlerSubmitClick(PointFormView.parseStateToPoint(this._state));
        break;
      case 'event__rollup-btn':
        this.#cancelSaveClickHandler();
        break;
      default:
    }
  };

  /**
   * Обработчик и валидация инпутов
   * @param {Event} event
   */
  //Валидирует сразу все input
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
   * @param {{id: string}} target id
   */
    const updateOfferSelect = ({ id }) => {
      const findOffer = this._state.offers.get(id);

      this._setState({ ...this._state, offers: this._state.offers.set(id, { ...findOffer, selected: !findOffer.selected }) });

    };

    const updateDectination = (target) => {
      target.value = target.value.trim();
      const destination = this.#destinationsByCities.get(target.value) || false;
      if (destination) {
        this.updateElement({ destination });
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
    this.updateElement({ type, offers });
  };

  /**
   * @param {PointObject | BLANK_POINT} point
   * @param {OffersByType} offersByTypes
   * @param {Destinations} destinations
   * @returns {State}
   */
  static parsePointToState(point, offersByTypes, destinations) {
    const availableTypes = Array.from(offersByTypes.keys());

    const pointype = point.type || availableTypes[0];
    const pointOffers = point.offers || [];

    const offersByType = offersByTypes.get(pointype) || new Map();

    offersByType.forEach((value, id) => {
      offersByType.set(id, { ...value, selected: pointOffers.includes(id) });
    });

    return {
      ...point,
      type: pointype,
      isEditForm: !!point.id,
      destination: point.destination ? destinations.get(point.destination) : false,
      offers: offersByType,
      availableTypes
    };
  }

  /**
   * @param {State} state
   * @returns {PointObject}
   */
  static parseStateToPoint(state) {
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

    const offersArray = Array.from(offers.values());

    const pointOffers = offers ? offersArray.filter((offer) => offer.selected).map((offer) => offer.id) : [];

    const point = {
      id: id ? id : '',
      basePrice: basePrice || 0,
      dateFrom: dateFrom || '',
      dateTo: dateTo || '',
      destination: destination ? destination.id : '',
      isFavorite,
      offers: pointOffers,
      type: type || ''
    };

    return point;
  }
}



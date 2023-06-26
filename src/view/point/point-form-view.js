//@ts-check
import 'flatpickr/dist/flatpickr.min.css';

import flatpickr from 'flatpickr';
import he from 'he';

//@ts-check
import {
  ButtonClassNames,
  FieldClasses,
  POINT_FORM_FORMAT,
} from '../../constants';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view';
import { humanizeDate } from '../../utils/points';

/**
 * @typedef {import('../../model/offers-model').Offer} Offer
 * @typedef {import('../../model/offers-model').OffersByType} OffersByType
 * @typedef {import('../../model/destinations-model').Destinations} Destinations
 * @typedef {import('../../model/destinations-model').Destination} Destination
 * @typedef { import('../../model/points-model').Point } Point
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
 * @property { boolean } isDisabled
 * @property { boolean } isSaving
 * @property { boolean } isDeleting
 * @property { Array<Offer> } availableTypes
*/

const BLANK_POINT = {
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
 * @param {boolean} isDisabled
 * @param {boolean} isSaving
 * @param {boolean} isDeleting
 * @returns {string} Возвращает шаблон кнопок под вид формы
 */
function createButton(isEditForm, isDisabled, isSaving, isDeleting) {
  const createEditButtonTemplate = () => `<button class="event__save-btn  btn  btn--blue" type="submit" disabled>${isSaving ? 'Saving...' : 'Save'}</button>
                                          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ' '}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
                                          <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ' '}>
                                            <span class="visually-hidden">Open event</span>
                                          </button>`;

  const createAddButtonTemplate = () => `<button class="event__save-btn  btn  btn--blue" type="submit" disabled>${isSaving ? 'Saving...' : 'Save'}</button>
                                         <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ' '}>Cancel</button>`;

  return isEditForm ? createEditButtonTemplate() : createAddButtonTemplate();
}

/**
 * @param {Map<string, Offer & {selected: boolean}>} offersByTypes Все предложения
 * @param {boolean} isDisabled
 * @returns {string}
 */
function createOffersSection(offersByTypes, isDisabled) {
  /**
 * @param {Offer} offer
 * @param {boolean} checked
 * @returns {string}
 */
  const createOffer = (offer, checked = false) => `<div class="event__offer-selector">
                                                      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${checked ? 'checked' : ''} ${isDisabled ? 'disabled' : ' '}>
                                                      <label class="event__offer-label" for="${offer.id}">
                                                        <span class="event__offer-title">${offer.title}</span>
                                                        &plus;&euro;&nbsp;
                                                        <span class="event__offer-price">${offer.price}</span>
                                                      </label>
                                                    </div>`;

  function getOffersTemplate() {
    const offersTemplate = Array.from(offersByTypes.values()).map((offer) => {
      if (offer.selected) {
        return createOffer(offer, true);
      }
      return createOffer(offer);
    }).join('\n');

    return offersTemplate;
  }

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
 * @param {boolean} isDisabled
 * @returns {string}
 */
function createDestinationsSelect(type, pointDestination, destinations, isDisabled) {
  const destinationSlelectTemplates = [];
  const cityName = pointDestination ? pointDestination.name : ' ';

  destinations.forEach((destination) => {
    destinationSlelectTemplates.push(`<option value="${destination.name}"></option>`);
  });

  const dedtinationSelectTemplate = `<div class="event__field-group  event__field-group--destination">
                                      <label class="event__label  event__type-output" for="event-destination-1">
                                        ${type}
                                      </label>
                                      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(cityName)}" list="destination-list-1" autocomplete="off" required ${isDisabled ? 'disabled' : ' '} >

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
  const createPhoto = (photoSrc, description) => `<img class="event__photo" src = "${photoSrc}" alt = "${description}" > `;

  function createPhotos() {
    const photos = destination.pictures.map((photo) => createPhoto(photo.src, photo.description));

    return photos.join('\n');
  }

  const getdestinationsTemplate = () => `<section class="event__section  event__section--destination" >
                                            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                                            <p class="event__destination-description">${destination.description}</p>

                                            <div class="event__photos-container">
                                              <div class="event__photos-tape">
                                              ${createPhotos()}
                                              </div>
                                            </div>
                                          </section>`;

  return destination?.description ? getdestinationsTemplate() : '';
}

/**
 * @param {string} selectType
 * @param {Array<string>} types
 * @param {boolean} isDisabled
 * @returns {String}
 */
function createPointTypes(selectType, types, isDisabled) {
  /**
   * @param {string} type
   * @param {Boolean} checked
   * @returns
   */
  function createPointType(type, checked = false) {
    const LowerCaseType = type.toLowerCase();
    const labelText = type.charAt(0).toUpperCase() + type.slice(1);
    return `<div class="event__type-item" >
              <input id="event-type-${LowerCaseType}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${LowerCaseType}" ${checked ? ' checked' : ''}>
              <label class="event__type-label event__type-label--${LowerCaseType}" for="event-type-${LowerCaseType}-1">${labelText}</label>
            </div>`;
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

    const typesSelectTemplate = `<div class="event__type-list" >
                                    <fieldset class="event__type-group">
                                      <legend class="visually-hidden">Event type</legend>
                                      ${typeTemplates.join('\n')}
                                    </fieldset>
                                  </div>`;
    return typesSelectTemplate;
  }

  const pointTypesTemplate = `<div class="event__type-wrapper" >
                                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                                  <span class="visually-hidden">Choose event type</span>
                                  <img class="event__type-icon" width="17" height="17" src="img/icons/${selectType}.png" alt="Event type icon">
                                </label>

                                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ' '}>
                                ${createPointTypesSelect()}
                              </div>`;

  return pointTypesTemplate;
}

/**
 * @param { Object } info object
 * @returns {string} Point template
 */
function createPointFormTemplate({ isEditForm, offers, type, availableTypes, dateFrom, dateTo, basePrice, destination, destinations, isDisabled, isSaving, isDeleting }) {
  const pointTypesTemplate = createPointTypes(type, availableTypes, isDisabled);
  const destinationsSelectTemplate = createDestinationsSelect(type, destination, destinations, isDisabled);
  const buttonsTemplate = createButton(isEditForm, isDisabled, isSaving, isDeleting);
  const startTime = humanizeDate(dateFrom, POINT_FORM_FORMAT);
  const endTime = humanizeDate(dateTo, POINT_FORM_FORMAT);
  const offersSectionTemplate = createOffersSection(offers, isDisabled);
  const destinationSectionTemplate = createDestinationSection(destination);
  const pointPrice = basePrice ? basePrice : '';

  return `<li class="trip-events__item" >
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                ${pointTypesTemplate}
                ${destinationsSelectTemplate}

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" required ${isDisabled ? 'disabled' : ' '}>

                  &mdash;

                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" required ${isDisabled ? 'disabled' : ' '}>
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="1" max="100000" value="${pointPrice}" required autocomplete="off" ${isDisabled ? 'disabled' : ' '}>
                </div>

                ${buttonsTemplate}
              </header>

              <section class="event__details">
                ${offersSectionTemplate}
                ${destinationSectionTemplate}
              </section>
            </form>
          </li>`;
}


/**
 * Класс представления формы изменения или добавления точки путешесвия
 * @class PointFormView
 */
export default class PointFormView extends AbstractStatefulView {
  #destinations;
  #offersByTypes;
  #destinationsByCities;

  #handleCancelClick;
  #handleSubmitClick;
  #handleDeleteClick;

  #dateToPicker;
  #dateFromPicker;

  #saveButton;

  /**
   * Конструктор компонента формы события
   * @param {{ point: Point | BLANK_POINT, destinations: Destinations, offersByTypes: OffersByType, handleDeleteClick: function, handleCancelClick: function, handleSubmitClick: function}} params
      */
  constructor({ point = BLANK_POINT, destinations, offersByTypes, handleCancelClick, handleDeleteClick, handleSubmitClick }) {
    super();
    this.#destinations = destinations;
    this.#offersByTypes = offersByTypes;

    this._setState(PointFormView.parsePointToState(point, this.#offersByTypes, this.#destinations));

    this.#handleCancelClick = handleCancelClick;
    this.#handleSubmitClick = handleSubmitClick;
    this.#handleDeleteClick = handleDeleteClick;


    this.#destinationsByCities = new Map();
    this.#destinations.forEach((destination) => this.#destinationsByCities.set(destination.name, destination));

    this._restoreHandlers();
  }

  get template() {
    return createPointFormTemplate({ ...this._state, destinations: this.#destinations });
  }

  /**
   * Сбрасывает состояние на изначальное
   * @param {Point} point
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
      !this._state.dateTo ||
      this._state.dateFrom >
      this._state.dateTo;
  }

  #setDatepicker = () => {
    const [dateFrom, dateTo] = this.element.querySelectorAll('.event__input--time');
    this.#dateToPicker = flatpickr(
      dateFrom,
      {
        dateFormat: 'd/m/y H:i',
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
        dateFormat: 'd/m/y H:i',
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
    this.#setDatepicker();
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
    this.#setDatepicker();
  };

  /**Обратывает отмену сохранения*/
  #cancelSaveClickHandler() {
    this.#handleCancelClick();
  }

  /**
 * Обработчик всех кнопок
 * @param {Event} evt
      */
  #buttosClickHandler = (evt) => {
    evt.preventDefault();
    const ButtonFunctions = {
      [ButtonClassNames.RESET]: () => this.#handleDeleteClick(PointFormView.parseStateToPoint(this._state)),
      [ButtonClassNames.SAVE]: () => this.#handleSubmitClick(PointFormView.parseStateToPoint(this._state)),
      [ButtonClassNames.ROLLUP]: () => this.#cancelSaveClickHandler()
    };

    ButtonFunctions[evt.target.className]();
  };

  /**
   * Обработчик и валидация инпутов
   * @param {Event} evt
      */
  //Валидирует сразу все input
  #inputsChangeHandler = (evt) => {
    const FieldFunctions = {
      [FieldClasses.DESTINATION]: (target) => {
        target.value = target.value.trim();
        const destination = this.#destinationsByCities.get(target.value) || false;
        if (destination) {
          this.updateElement({ destination });
          return;
        }
        target.value = ' ';
        this._setState({ ...this._state, destination: false });
      },

      [FieldClasses.PRICE]: (target) => {
        const basePrice = Number(target.value);
        if (basePrice) {
          target.value = basePrice;
          this._setState({ ...this._state, basePrice });
          return;
        }

        this._setState({ ...this._state, basePrice: false });
      },

      [FieldClasses.OFFER]: ({ id }) => {
        const findOffer = this._state.offers.get(id);
        this._setState({ ...this._state, offers: this._state.offers.set(id, { ...findOffer, selected: !findOffer.selected }) });
      },

      [FieldClasses.TIME]: () => false
    };

    const className = evt.target.className;

    if (className.includes(FieldClasses.TYPE)) {
      return;
    }

    FieldFunctions[className](evt.target);

    this.#saveButton = this.element.querySelector('.event__save-btn');

    this.#saveButton.disabled = this.#isSubmitDisabled();
  };

  /**@param {Event} evt*/
  #typeChangeHandler = (evt) => {
    const type = evt.target.value;
    const offers = this.#offersByTypes.get(type);
    offers.forEach((/** @type {Offer & { selected: boolean }}} */ offer) => {
      offer.selected = false;
    });
    this.updateElement({ type, offers });

    this.#saveButton = this.element.querySelector('.event__save-btn');
    this.#saveButton.disabled = this.#isSubmitDisabled();
  };

  /**
   * @param {Point | BLANK_POINT} point
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
      availableTypes,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  /**
   * @param {State} state
   * @returns {Point}
   */
  static parseStateToPoint(state) {
    const offersArray = Array.from(state.offers.values());

    const pointOffers = offersArray.filter((offer) => offer.selected).map((offer) => offer.id);

    const point = {
      ...state,
      offers: pointOffers,
      destination: state.destination.id
    };

    delete point.availableTypes;
    delete point.isEditForm;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}



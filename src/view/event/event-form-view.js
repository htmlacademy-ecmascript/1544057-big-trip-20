import { EVENT_FORM_FORMAT } from '../../constants.js';
import AbstractView from '../../framework/view/abstract-stateful-view.js';
import { getRandomInteger } from '../../utils/commons.js';
import { humanizeDate } from '../../utils/events.js';

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

const renderPhoto = (photoSrc) => `<img class="event__photo" src="${photoSrc}" alt="Event photo">'`;


const renderPhotos = () => {
  const photosLength = getRandomInteger(1, 5);
  const photos = [];

  for (let i = 1; i <= photosLength; i++) {
    photos.push(renderPhoto(`img/photos/${i}.jpg`));
  }
  return photos.join('\n');
};

/**
 *
 * @param {Object} offer
 * @returns {string}
 */
const createOffer = (offer) => `
<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage">
  <label class="event__offer-label" for="${offer.id}">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`;

/**
 *
 * @param {Array} offers
 * @returns {string}
 */
const createOffers = (offers) => offers.map((offer) => createOffer(offer)).join('\n');
/**
 *
 * @param {Array} destinations
 * @returns {string}
 */
const createDestinations = (destinations) => destinations.map((elem) => `<option value="${elem.name}"></option>`).join();

/**
 *
 * @param {string} formType
 * @param {object} param1 Event info object
 * @param {Array<object>} destinations array of destination
 * @returns {string} Event template
 */
const createEventFormTemplate = (formType, { offers, eventType, eventCityName, eventStartDate, eventEndDate, eventPrice, destination }, destinations) => `
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper" >
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          <div class="event__type-item">
            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
            <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
            <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
            <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
            <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
            <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
            <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
            <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
            <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
            <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
          </div>
        </fieldset>
      </div>
    </div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${eventType}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventCityName}" list="destination-list-1">
      <datalist id="destination-list-1">
      ${createDestinations(destinations)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(eventStartDate, EVENT_FORM_FORMAT)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(eventEndDate, EVENT_FORM_FORMAT)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventPrice}">
    </div>
    ${formType === 'addForm' ? createAddButtonTemplate() : createEditButtonTemplate()}
  </header >

  <section class="event__details">

    <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOffers(offers)}
        </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${renderPhotos()}
        </div>
      </div>
    </section>
  </section>
</form>`;


/** Класс представления формы изменения или добавления точки путешесвия
 * @class EventFormView
*/
export default class EventFormView extends AbstractView {
  #eventInfo = null;
  #formType = null;
  #destinations = null;
  #handlerEditClick = null;

  constructor({ formType, eventInfo, destinations, onButtonClick }) {
    super();
    this.#eventInfo = eventInfo;
    this.#formType = formType;
    this.#destinations = destinations;
    this.#handlerEditClick = onButtonClick;

    this.element.querySelector('.event__save-btn ').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventFormTemplate(this.#formType, this.#eventInfo, this.#destinations);
  }

  #editClickHandler = (event) => {
    event.preventDefault();
    this.#handlerEditClick();
  };
}

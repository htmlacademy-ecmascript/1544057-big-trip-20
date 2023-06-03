import { EVENT_INFO_FORMAT, RENDER_DATE_FORMAT } from '../../constants';
import AbstractView from '../../framework/view/abstract-stateful-view';
import { calculateDuration, humanizeDate } from '../../utils/events';

const createOffer = ({ title, price }) => `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`;

const renderOffers = (offers) => offers.map((offer) => createOffer(offer)).join('\n');


const createEventInfoTemplate = ({ eventType, eventCityName, eventStartDate, eventEndDate, eventPrice, isFavorite, offers }) => `
<li class="trip-events__item">
  <div class="event">
  <time class="event__date" datetime = "${eventStartDate}" > ${humanizeDate(eventStartDate, RENDER_DATE_FORMAT)}</time >
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${eventType} ${eventCityName}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${eventStartDate}" > ${humanizeDate(eventStartDate, EVENT_INFO_FORMAT)}</time>
      &mdash;
      <time class="event__end-time" datetime="${eventEndDate}" > ${humanizeDate(eventEndDate, EVENT_INFO_FORMAT)}</time>
    </p>
    <p class="event__duration">${calculateDuration(eventStartDate, eventEndDate)}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${eventPrice}</span>
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
  #eventInfo = null;
  #handlerEditClick = null;

  constructor({ eventInfo, onButtonClick }) {
    super();
    this.#eventInfo = eventInfo;
    this.#handlerEditClick = onButtonClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEventInfoTemplate(this.#eventInfo);
  }

  #editClickHandler = (event) => {
    event.preventDefault();
    this.#handlerEditClick();
  };
}

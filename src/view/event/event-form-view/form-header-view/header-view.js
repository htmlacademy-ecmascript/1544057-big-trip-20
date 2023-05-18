import { createElement } from '../../../../render.js';
import { humanizeDate } from '../../../../utils.js';
import { EVENT_FORM_FORMAT } from '../../../../constants.js';

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

const createFormHeaderTemplate = (headerButton, { eventType, eventCityName, eventStartDate, eventEndDate, eventPrice }, destinations) => `
<header class="event__header">
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${eventType}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventCityName}" list="destination-list-1">
    <datalist id="destination-list-1">
    ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join()}
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
  ${headerButton}
</header>`;

export default class EventFormHeaderView {
  constructor({ formType, eventInfo, destinations }) {
    this.formType = formType;
    this.eventInfo = eventInfo;
    this.destinations = destinations;
  }

  getTemplate() {
    const headerButton = this.formType === 'addForm' ? createAddButtonTemplate() : createEditButtonTemplate();
    return createFormHeaderTemplate(headerButton, this.eventInfo, this.destinations);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

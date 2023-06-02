import { Filters } from '../constants';
import AbstractView from '../framework/view/abstract-stateful-view';

const Texts = {
  [Filters.EVERYTHING]: 'Click New Event to create your first point',
  [Filters.PAST]: 'There are no past events now',
  [Filters.PRESENT]: 'There are no present events now',
  [Filters.FUTURE]: 'There are no future events now'
};

const createEventsEmplyTemplate = (selectFilter) => `
<p class="trip-events__msg">
  ${Texts[selectFilter]}
</p>`;

export default class EventsEmplyView extends AbstractView {
  #selectFilter = null;

  constructor(selectFilter) {
    super();
    this.#selectFilter = selectFilter;
  }

  get template() {
    return createEventsEmplyTemplate(this.#selectFilter);
  }
}

import { FilterTypes } from '../constants';
import AbstractView from '../framework/view/abstract-stateful-view';

const Texts = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.PAST]: 'There are no past events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.FUTURE]: 'There are no future events now'
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

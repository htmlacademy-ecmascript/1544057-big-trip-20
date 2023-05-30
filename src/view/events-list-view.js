import AbstractView from '../framework/view/abstract-stateful-view';

const createEventsListTemplate = () => `<ul class="trip-events__list">
          </ul>`;

export default class EventsListView extends AbstractView {
  get template() {
    return createEventsListTemplate();
  }
}

import { FilterTypes } from '../constants';
import AbstractView from '../framework/view/abstract-stateful-view';

const Texts = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.PAST]: 'There are no past points now',
  [FilterTypes.PRESENT]: 'There are no present points now',
  [FilterTypes.FUTURE]: 'There are no future points now'
};

const createPointsEmplyTemplate = (selectFilter) => `<p class="trip-events__msg">
                                                        ${Texts[selectFilter]}
                                                      </p>`;

export default class PointsEmptyView extends AbstractView {
  #selectFilter = null;

  constructor({ selectFilter }) {
    super();
    this.#selectFilter = selectFilter;
  }

  get template() {
    return createPointsEmplyTemplate(this.#selectFilter);
  }
}

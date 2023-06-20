import AbstractView from '../framework/view/abstract-stateful-view';

const createPointsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointsListView extends AbstractView {
  get template() {
    return createPointsListTemplate();
  }
}

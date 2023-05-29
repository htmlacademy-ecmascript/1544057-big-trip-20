import AbstractView from '../../../framework/view/abstract-stateful-view';

const createEventFormTemplate = () => '<form class="event event--edit" action="#" method="post"></form>';

export default class EventFormView extends AbstractView {
  get template() {
    return createEventFormTemplate();
  }

}

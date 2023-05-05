import EventSortView from './view/events-sort-view.js';
import EventsListView from './view/events-list-view.js';
import EventFormView from './view/event-form-view/event-form-view.js';
import EventFormHeaderView from './view/event-form-view/event-form-header-view/event-form-header-edit-view.js';
import EventFormDetailsView from './view/event-form-view/event-form-details-view/event-form-details-view.js';
import EventFormDestinationView from './view/event-form-view/event-form-details-view/event-form-destination-view.js';
import EventFormOffersView from './view/event-form-view/event-form-details-view/event-from-offers-view.js';
import EventsItemView from './view/events-item-view.js';
import { render, RenderPosition } from './render.js';
import { EVENT_COUNT } from './constants.js';

export default class EventsPresenter {
  sortEventsComponent = new EventSortView();
  eventListComponent = new EventsListView();
  eventFormComponent = new EventFormView();
  eventFormHeaderComponent = new EventFormHeaderView();
  eventFormDetailsComponent = new EventFormDetailsView();
  eventFormOffresComponent = new EventFormOffersView();
  eventFormDestinationComponent = new EventFormDestinationView();

  constructor({ eventsContainer }) {
    this.eventsContainer = eventsContainer;
  }

  init() {
    render(this.sortEventsComponent, this.eventsContainer, RenderPosition.AFTERBEGIN);
    render(this.eventListComponent, this.eventsContainer, RenderPosition.BEFOREEND);

    const eventListContinerNode = document.querySelector('.trip-events__list');

    render(this.eventFormComponent, eventListContinerNode, RenderPosition.BEFOREEND);

    const eventFromConstainerNode = document.querySelector('.event--edit');

    render(this.eventFormHeaderComponent, eventFromConstainerNode, RenderPosition.BEFOREEND);
    render(this.eventFormDetailsComponent, eventFromConstainerNode, RenderPosition.BEFOREEND);

    const eventFormDetailsConstainerNode = document.querySelector('.event__details');


    render(this.eventFormOffresComponent, eventFormDetailsConstainerNode, RenderPosition.BEFOREEND);
    render(this.eventFormDestinationComponent, eventFormDetailsConstainerNode, RenderPosition.BEFOREEND);


    for (let i = 0; i < EVENT_COUNT; i++) {
      render(new EventsItemView(), eventListContinerNode, RenderPosition.BEFOREEND);
    }
  }
}

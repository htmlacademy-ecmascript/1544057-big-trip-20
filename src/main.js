import TripInfoView from './view/trip-info-view';
import EventsFilterView from './view/events-filter-view';
import EventsPresenter from './events-presenter.js';
import { render, RenderPosition } from './render';

const filterContinerNode = document.querySelector('.trip-controls__filters');
const tripInfoContinerNode = document.querySelector('.trip-main');
const eventsConstainerNode = document.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter({ eventsContainer: eventsConstainerNode });

render(new TripInfoView(), tripInfoContinerNode, RenderPosition.AFTERBEGIN);
render(new EventsFilterView(), filterContinerNode, RenderPosition.AFTERBEGIN);

eventsPresenter.init();

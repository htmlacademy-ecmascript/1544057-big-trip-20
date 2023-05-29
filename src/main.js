import { render, RenderPosition } from './framework/render.js';
import EventsContainerPresenter from './presenter/events-container-presenter';
import EventsFilterView from './view/events-filter-view';
import TripInfoView from './view/trip-info-view';

const filterContinerNode = document.querySelector('.trip-controls__filters');
const tripInfoContinerNode = document.querySelector('.trip-main');


render(new TripInfoView(), tripInfoContinerNode, RenderPosition.AFTERBEGIN);
render(new EventsFilterView(), filterContinerNode, RenderPosition.AFTERBEGIN);

const eventsContainerPresenter = new EventsContainerPresenter();

eventsContainerPresenter.init();

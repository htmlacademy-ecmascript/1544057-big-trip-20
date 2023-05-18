import TripInfoView from './view/trip-info-view';
import EventsFilterView from './view/events-filter-view';
import EventsContainerPresenter from './presenter/events-container-presenter';
import { render, RenderPosition } from './render';

const filterContinerNode = document.querySelector('.trip-controls__filters');
const tripInfoContinerNode = document.querySelector('.trip-main');


render(new TripInfoView(), tripInfoContinerNode, RenderPosition.AFTERBEGIN);
render(new EventsFilterView(), filterContinerNode, RenderPosition.AFTERBEGIN);

const eventsContainerPresenter = new EventsContainerPresenter();

eventsContainerPresenter.init();

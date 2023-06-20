import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model.js';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import PointsBoardPresenter from './presenter/points-board-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel({ destinations: destinationsModel.destinations, offers: offersModel.offers });

const mainContainerNode = document.querySelector('.trip-main');
const filterContinerNode = document.querySelector('.trip-controls__filters');
const pointsConstainerNode = document.querySelector('.trip-events');

const tripInfoPresenter = new TripInfoPresenter({
  container: mainContainerNode,
  destinations: destinationsModel.destinations,
  offersModel,
  points: pointsModel.points
});

const filtersPresenter = new FiltersPresenter({
  pointsModel,
  filterModel,
  FiltersContainer: filterContinerNode
});

const pointsBoardPresenter = new PointsBoardPresenter({
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  pointsConstainer: pointsConstainerNode
});

tripInfoPresenter.init();
filtersPresenter.init();
pointsBoardPresenter.init();

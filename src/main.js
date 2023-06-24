//@ts-check
import AppApiService from './app-api-service';
import { AUTHORIZATION, Urls } from './constants';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';
import OffersModel from './model/offers-model';
import PointsModel from './model/points-model';
import BoardPresenter from './presenter/board-presenter';

const appApiService = new AppApiService(Urls.APP_API, AUTHORIZATION);

const destinationsModel = new DestinationsModel({ appApiService });
const filterModel = new FilterModel();
const offersModel = new OffersModel({ appApiService });
const pointsModel = new PointsModel({ appApiService });


const pageContainerNode = document.querySelector('.page-body');

const boardPresenter = new BoardPresenter({
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  container: pageContainerNode,
});

destinationsModel.init()
  .then(() =>
    offersModel.init()
      .then(() =>
        pointsModel.init()
      )
  );

boardPresenter.init();

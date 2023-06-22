import { remove, render } from '../framework/render';
import DestinationsModel from '../model/destinations-model';
import FilterModel from '../model/filter-model.js';
import OffersModel from '../model/offers-model';
import PointsModel from '../model/points-model.js';
import FiltersPresenter from '../presenter/filters-presenter.js';
import PointsBoardPresenter from '../presenter/points-board-presenter';
import TripInfoPresenter from '../presenter/trip-info-presenter.js';
import LoadingView from '../view/loading-view.js';
import newPointButtonView from '../view/new-point-button-view';

export default class AppPresenter {
  #appContainer;
  #headerContainer;
  #eventsBoardContainer;

  #appApiService;
  #destinationsModel;
  #filterModel;
  #offersModel;
  #pointsModel;

  #tripInfoPresenter;
  #filtersPresenter;
  #pointsBoardPresenter;

  #newPointButtonComponent;
  #loadingComponent = new LoadingView();

  constructor({ appContainer, appApiService }) {
    this.#appContainer = appContainer;

    this.#appApiService = appApiService;

    this.#destinationsModel = new DestinationsModel({ appApiService: this.#appApiService });
    this.#filterModel = new FilterModel();
    this.#offersModel = new OffersModel({ appApiService: this.#appApiService });
    this.#pointsModel = new PointsModel({ appApiService: this.#appApiService });

    this.#headerContainer = this.#appContainer.querySelector('.trip-main');
    this.#eventsBoardContainer = this.#appContainer.querySelector('.trip-events');

    this.#tripInfoPresenter = new TripInfoPresenter({
      container: this.#headerContainer,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      pointsModel: this.#pointsModel
    });

    this.#filtersPresenter = new FiltersPresenter({
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
      filtersContainer: this.#headerContainer.querySelector('.trip-controls__filters')
    });

    this.#pointsBoardPresenter = new PointsBoardPresenter({
      pointsModel: this.#pointsModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      filterModel: this.#filterModel,
      pointsConstainer: this.#eventsBoardContainer,
      onNewTaskDestroy: this.#handleNewPointFormClose
    });

    this.#newPointButtonComponent = new newPointButtonView({
      onClick: this.#handleNewPointButtonClick
    });

  }

  async init() {
    this.#renderLoading();

    await this.#pointsModel.init();
    await this.#offersModel.init();
    await this.#destinationsModel.init();

    remove(this.#loadingComponent);

    this.#tripInfoPresenter.init();
    this.#filtersPresenter.init();
    this.#pointsBoardPresenter.init();

    render(this.#newPointButtonComponent, this.#headerContainer);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsBoardContainer);
  }

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleNewPointButtonClick = () => {
    this.#pointsBoardPresenter.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };
}

//@ts-check
import { remove, render, RenderPosition } from '../framework/render';
import TripInfoView from '../view/trip-info-view';

/**
 * @typedef {import('../model/destinations-model').default} DestinationsModel
 * @typedef {import('../model/offers-model').default} OffersModel
 * @typedef {import('../model/points-model').Point} Point
 * @typedef {import('../model/points-model').default} PointsModel
 */

export default class TripInfoPresenter {
  /** @type {HTMLElement} */
  #container;
  /** @type { TripInfoView } */
  #tripInfoComponent;
  #destinationsModel;
  #offersModel;

  /** @param { {container: HTMLElement, destinationsModel: DestinationsModel, offersModel: OffersModel} } params */
  constructor({ container, destinationsModel, offersModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  /**
   * @param {Array<Point>} points
   */
  init(points) {
    const destinations = this.#destinationsModel.destinations;

    if (points.length > 0) {
      const summary = (/** @type {number[]} */ ...arr) => arr.reduce((partialSum, a) => partialSum + a, 0);

      const pointsCity = points.map((point) => destinations.get(point.destination)?.name || []);

      const pointsDates = points.map((point) => point.dateFrom);

      const offersId = points.map((point) => point.offers).flat();
      const offersCost = offersId.map((id) => this.#offersModel.getOffer(id)?.price || 0);
      const pointsCost = points.map((point) => point.basePrice);
      const tripCost = summary(...offersCost, ...pointsCost);

      this.#tripInfoComponent = new TripInfoView({ pointsDates, pointsCity, tripCost });

      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
    }
  }

  destroy() {
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }
  }
}


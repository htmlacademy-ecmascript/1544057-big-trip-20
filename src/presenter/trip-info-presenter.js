//@ts-check
import { remove, render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view';

/**
 * @typedef {import('../model/destinations-model.js').Destinations} Destinations
 * @typedef {import('../model/offers-model.js').default} OffersModel
 * @typedef {import('../model/points-model.js').PointObject} PointObject
 * @typedef {import('../model/points-model.js').Points} Points
 */

export default class TripInfoPresenter {
  /** @type {HTMLElement} */
  #container;
  /** @type { TripInfoView } */
  #tripInfoComponent;
  #destinations;
  #offersModel;
  #points;

  /** @param { {container: HTMLElement, destinations: Destinations, offersModel: OffersModel, points: Points} } params */
  constructor({ container, destinations, offersModel, points }) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offersModel = offersModel;
    this.#points = Array.from(points.values());
  }

  init() {
    if (this.#points.length > 0) {
      const summary = (/** @type {number[]} */ ...arr) => arr.reduce((partialSum, a) => partialSum + a, 0);

      const pointsCity = this.#points.map((point) => this.#destinations.get(point.destination)?.name || []);

      const pointsDates = this.#points.map((point) => point.dateFrom);

      const offersId = this.#points.map((point) => point.offers).flat();
      const offersCost = offersId.map((id) => this.#offersModel.getOffer(id)?.price || 0);
      const pointsCost = this.#points.map((point) => point.basePrice);
      const tripCost = summary(...offersCost, ...pointsCost);

      this.#tripInfoComponent = new TripInfoView({ pointsDates, pointsCity, tripCost });

      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
    }


  }

  destroy() {
    remove(this.#tripInfoComponent);
  }
}


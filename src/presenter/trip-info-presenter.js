//@ts-check
import { remove, render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  /** @type {HTMLElement} */
  #container;
  /** @type{TripInfoView} */
  #tripInfoComponent;
  #destinationsModel;
  #offersModel;
  #eventsModel;
  /**@type {Array} */
  #tripEvents;

  /**
   * @typedef Params
   * @type {object}
   * @property {HTMLElement} container
   * @property {object} destinationsModel
   * @property {object} offersModel
   * @property {object} eventsModel
  */

  /**
   * @param {Params} params
   */
  constructor({ container, destinationsModel, offersModel, eventsModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
    this.#tripEvents = [...this.#eventsModel.events];
  }

  init() {
    const summary = (/** @type {number[]} */ ...arr) => arr.reduce((partialSum, a) => partialSum + a, 0);

    const eventsCity = this.#tripEvents.map((event) => this.#destinationsModel.getById(event.destination).name);

    const eventsDates = this.#tripEvents.map((event) => event.dateFrom);

    const offersId = this.#tripEvents.map((event) => event.offers).flat();
    const offersCost = offersId.map((id) => this.#offersModel.getById(id).price);
    const eventsCost = this.#tripEvents.map((event) => event.basePrice);
    const tripCost = summary(...offersCost, ...eventsCost);

    this.#tripInfoComponent = new TripInfoView({ eventsDates, eventsCity, tripCost });

    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this.#tripInfoComponent);
  }
}



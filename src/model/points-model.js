//@ts-check
import { MAX_POINTS, MAX_SELECT_OFFERS, MIN_POINTS } from '../constants';
import Observable from '../framework/observable.js';
import { getRandomArrayElement, getRandomInteger } from '../mock/commons';
import { generatePoint } from '../mock/points-mock';

/**
 * @typedef {import('../mock/points-mock').PointObject} PointObject
 * @typedef {import('./offers-model').OffersByType} OffersByType
 * @typedef {import('./destinations-model').Destinations} Destinations
 */

/**
 * @typedef Points
 * @type {Array<PointObject>}
 */

export default class PointsModel extends Observable {
  #destinations;
  #offers;
  #points = new Map();

  /**
   * @param {{destinations: Destinations, offers: OffersByType}} params
   */
  constructor({ destinations, offers }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;

    const generatePoints = Array.from({ length: getRandomInteger(MIN_POINTS, MAX_POINTS) }, this.#generatePoint);

    generatePoints.forEach((point) => this.#points.set(point.id, point));
  }

  /**
   * @returns {Points}
   */
  get points() {
    return Array.from(this.#points.values());
  }

  /**
   * Обновляет определенный point
   * @param {string} updateType
   * @param {PointObject} update
   */
  updatePoint(updateType, update) {
    if (!this.#points.has(update.id)) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = this.#points.set(update.id, update);

    this._notify(updateType, update);
  }

  /**
   * Добавляет новый point
   * @param {string} updateType
   * @param {PointObject} update
   */
  addPoint(updateType, update) {
    if (this.#points.has(update.id)) {
      throw new Error('Can\'t add, this task is existing');
    }

    this.#points.set(update.id, update);
    this._notify(updateType, update);
  }

  /**
   * Удаляет опеределенный point
   * @param {string} updateType
   * @param {PointObject} update
   */
  deletePoint(updateType, update) {
    if (!this.#points.has(update.id)) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points.delete(update.id);
    this._notify(updateType, update);
  }

  /**
   * Генерерирует point из mock-ов
   * @returns {PointObject}
   */
  #generatePoint = () => {
    const point = generatePoint();
    const offers = this.#offers.get((point.type)) || [];

    point.destination = getRandomArrayElement([...this.#destinations.values()]).id;
    point.offers = [...offers.values()].splice(0, getRandomInteger(1, MAX_SELECT_OFFERS)).map((offer) => offer.id);

    return point;
  };

}

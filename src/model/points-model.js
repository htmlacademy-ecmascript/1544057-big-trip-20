import { UpdateType } from '../constants';
import Observable from '../framework/observable';

/**
 * @typedef {import('./offers-model').OffersByType} OffersByType
 * @typedef {import('./destinations-model').Destinations} Destinations
 * @typedef { import('../app-api-service').default} AppApiService
 */

/**
 * @typedef Point
 * @type {Object}
 * @property {string} id
 * @property {number} basePrice
 * @property {string} dateFrom
 * @property {string} dateTo
 * @property {string} destination
 * @property {boolean} isFavorite
 * @property {Array<string>} offers
 * @property {string} type
 */

/**
 * @typedef Points
 * @type {Array<Point>}
 */

/**
 * @typedef MapPoints
 * @type {Map<string, Point>}
 */

/**
 * @typedef ServerPoint
 * @type {object}
 * @property {string} id
 * @property {number} base_price
 * @property {string} date_from
 * @property {string} date_to
 * @property {string} destination
 * @property {boolean} is_favorite
 * @property {Array<string>} offers
 * @property {string} type
 */

export default class PointsModel extends Observable {
  #appApiService;
  /** @type {MapPoints} */
  #points = new Map();

  /**
   * @param {{appApiService: AppApiService}} props
   */
  constructor({ appApiService }) {
    super();
    this.#appApiService = appApiService;
  }

  /**
   * @returns {Points}
   */
  get points() {
    return Array.from(this.#points.values());
  }

  async init() {
    try {
      const points = await this.#appApiService.points;

      points.forEach((point) => {
        const adaptPoint = this.#adaptToClient(point);

        this.#points.set(adaptPoint.id, adaptPoint);
      });
    } catch (error) {
      this.#points = new Map();
    }

    this._notify(UpdateType.INIT);
  }

  /**
   * Обновляет определенный point
   * @param {string} updateType
   * @param {Point} update
   */
  async updatePoint(updateType, update) {
    if (!this.#points.has(update.id)) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#appApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points.set(updatedPoint.id, updatedPoint);
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  /**
   * Добавляет новый point
   * @param {string} updateType
   * @param {Point} update
   */
  async addPoint(updateType, update) {
    if (this.#points.has(update.id)) {
      throw new Error('Can\'t add, this task is existing');
    }
    try {
      const response = await this.#appApiService.addPoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points.set(updatedPoint.id, updatedPoint);
      this._notify(updateType, updatedPoint);
    } catch (error) {
      throw new Error('Can\'t add point');
    }
  }

  /**
   * Удаляет опеределенный point
   * @param {string} updateType
   * @param {Point} update
   */
  async deletePoint(updateType, update) {
    if (!this.#points.has(update.id)) {
      throw new Error('Can\'t delete unexisting task');
    }

    try {
      await this.#appApiService.deletePoint(update);
      this.#points.delete(update.id);

      this._notify(updateType);
    } catch (error) {
      throw new Error('Can\'t delete point');
    }
  }

  /**
   * @param {ServerPoint} point
   * @returns {MapPoints}
   */
  #adaptToClient(point) {
    const adaptPoint = {
      ...point,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      basePrice: point.base_price,
      isFavorite: point.is_favorite
    };

    delete adaptPoint.date_from;
    delete adaptPoint.date_to;
    delete adaptPoint.base_price;
    delete adaptPoint.is_favorite;

    return adaptPoint;
  }
}

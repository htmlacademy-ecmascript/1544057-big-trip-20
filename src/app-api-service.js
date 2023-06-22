//@ts-check
/**@typedef {import('./model/points-model').Point} Point*/
/**
 * @typedef  AdaptedPoint
 * @type {Object}
 * @property {string} id
 * @property {number} base_price
 * @property {string} date_from
 * @property {string} date_to
 * @property {string} destination
 * @property {boolean} is_favorite
 * @property {string[]} offers
 * @property {string} type
 */
import { Method, Urls } from './constants';
import ApiService from './framework/api-service';

export default class AppApiService extends ApiService {
  /**
   * Получаем точки маршрута
   */
  get points() {
    return this._load({ url: Urls.POINTS })
      .then(ApiService.parseResponse);
  }

  /**
   * Получаем предложения
   */
  get offers() {
    return this._load({ url: Urls.OFFERS })
      .then(ApiService.parseResponse);
  }

  /**
   * Получаем направления
   */
  get destinations() {
    return this._load({ url: Urls.DESTINATIONS })
      .then(ApiService.parseResponse);
  }

  /**
  * Обновляет точку маршрута
  * @param {Point} point
  * @returns
  */
  async updatePoint(point) {
    const body = JSON.stringify(this.#adaptToServer(point));

    const response = await this._load({
      url: `${Urls.POINTS}/${point.id}`,
      method: Method.PUT,
      body,
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;

  }

  /**
   * Добавляет новую точку маршрута
   * @param {Point} point
   * @returns
   */
  async addPoint(point) {
    const response = await this._load({
      url: Urls.POINTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  /**
   * Удаляет точку маршрута
   * @param {Point} point
   * @returns
   */
  async deletePoint(point) {
    const response = await this._load({
      url: `${Urls.POINTS}/${point.id}`,
      method: Method.DELETE
    });

    return response;
  }

  /**
   * Преобразует point к формату SnakeCase
   * @param {Point} point
   * @returns {AdaptedPoint}
   */
  #adaptToServer(point) {
    /** @type {AdaptedPoint & Point} */
    const adaptedPoint = {
      ...point,
      'base_price': Number(point.basePrice),
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': Boolean(point.isFavorite)
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}


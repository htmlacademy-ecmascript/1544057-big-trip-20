import { RENDER_DATE_FORMAT } from '../constants';
import AbstractView from '../framework/view/abstract-view';
import { humanizeDate } from '../utils/points';

//Amsterdam & mdash; Chamonix & mdash; Geneva;
const renderCities = (cities) => {
  const uniqCities = [...new Set(cities)];

  const firstCity = uniqCities.at();
  const secondCity = uniqCities.at(1);
  const lastCity = uniqCities.at(-1);

  const CITY_COUNT = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
  };


  let result;
  switch (uniqCities.length) {
    case CITY_COUNT.ONE:
      result = firstCity;
      break;
    case CITY_COUNT.TWO:
      result = `${firstCity}  &mdash; ${lastCity} `;
      break;
    case CITY_COUNT.THREE:
      result = `${firstCity} &mdash; ${secondCity}  &mdash; ${lastCity} `;
      break;
    default:
      result = `${firstCity} &mdash;... &mdash; ${lastCity} `;
  }
  return result;
};

const renderTripDate = (dates) => {
  const firstDate = humanizeDate(dates.at(), RENDER_DATE_FORMAT);
  const lastDate = humanizeDate(dates.at(-1), RENDER_DATE_FORMAT);

  const DATE_COUNT = {
    ONE: 1,
  };

  let result;
  switch (dates.length) {
    case DATE_COUNT.ONE:
      result = firstDate;
      break;
    default:
      result = `${firstDate}&nbsp;&mdash;&nbsp;${lastDate}`;
  }

  return result;
};

const createTripInfoTemplate = ({ dates, cities, tripCost }) => `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${renderCities(cities)}</h1>

              <p class="trip-info__dates">${renderTripDate(dates)}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
            </p>
          </section>`;

export default class TripInfoView extends AbstractView {
  #pointsDates = null;
  #pointsCity = null;
  #tripCost = null;

  constructor({ pointsDates, pointsCity, tripCost }) {
    super();
    this.#pointsDates = pointsDates;
    this.#pointsCity = pointsCity;
    this.#tripCost = tripCost;
  }

  get template() {
    return createTripInfoTemplate({ dates: this.#pointsDates, cities: this.#pointsCity, tripCost: this.#tripCost });
  }
}

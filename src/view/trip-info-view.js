import { RENDER_DATE_FORMAT } from '../constants';
import AbstractView from '../framework/view/abstract-view';
import { humanizeDate } from '../utils/points';

//Amsterdam & mdash; Chamonix & mdash; Geneva;
const renderCities = (cities) => {
  const uniqCities = [...new Set(cities)];
  let result;
  switch (uniqCities.length) {
    case 1:
      result = uniqCities.at();
      break;
    case 2:
      result = `${uniqCities.at()}  &mdash; ${uniqCities.at(-1)} `;
      break;
    case 3:
      result = `${uniqCities.at()} &mdash; ${uniqCities.at(1)}  &mdash; ${uniqCities.at(-1)} `;
      break;
    default:
      result = `${uniqCities.at()} &mdash;... &mdash; ${uniqCities.at(-1)} `;
  }
  return result;
};

const renderTripDate = (dates) => {
  let result;
  switch (dates.length) {
    case 1:
      result = humanizeDate(dates.at(), RENDER_DATE_FORMAT);
      break;
    default:
      result = `${humanizeDate(dates.at(), RENDER_DATE_FORMAT)}&nbsp;&mdash;&nbsp;${humanizeDate(dates.at(-1), RENDER_DATE_FORMAT)}`;
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

import { RENDER_DATE_FORMAT } from '../constants';
import AbstractView from '../framework/view/abstract-view';
import { humanizeDate } from '../utils/events';

//Amsterdam & mdash; Chamonix & mdash; Geneva;
const renderCites = (cites) => {
  const uniqCites = [...new Set(cites)];
  let result;
  switch (uniqCites.length) {
    case 1:
      result = uniqCites.at();
      break;
    case 2:
      result = `${uniqCites.at()}  &mdash; ${uniqCites.at(-1)} `;
      break;
    case 3:
      result = `${uniqCites.at()} &mdash; ${uniqCites.at(1)}  &mdash; ${uniqCites.at(-1)} `;
      break;
    default:
      result = `${uniqCites.at()} &mdash;... &mdash; ${uniqCites.at(-1)} `;
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

const createTripInfoTemplate = ({ dates, cites, tripCost }) => `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${renderCites(cites)}</h1>

              <p class="trip-info__dates">${renderTripDate(dates)}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
            </p>
          </section>`;

export default class TripInfoView extends AbstractView {
  #eventsDates = null;
  #eventsCity = null;
  #tripCost = null;

  constructor({ eventsDates, eventsCity, tripCost }) {
    super();
    this.#eventsDates = eventsDates;
    this.#eventsCity = eventsCity;
    this.#tripCost = tripCost;
  }

  get template() {
    return createTripInfoTemplate({ dates: this.#eventsDates, cites: this.#eventsCity, tripCost: this.#tripCost });
  }
}

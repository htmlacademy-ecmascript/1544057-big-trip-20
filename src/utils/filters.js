//@ts-check
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { FilterTypes } from '../constants';

dayjs.extend(isBetween);

/** @typedef {import('../model/points-model').Point} Point */
/** @typedef {import('../model/points-model').Points} Points */

const filterСonditions = {
  [FilterTypes.EVERYTHING]: (/** @type {Point} */point) => !!point,
  [FilterTypes.FUTURE]: (/** @type {Point} */point) => dayjs().isBefore(dayjs(point.dateFrom)),
  [FilterTypes.PAST]: (/** @type {Point} */point) => dayjs().isAfter(dayjs(point.dateTo)),
  [FilterTypes.PRESENT]: (/** @type {Point} */point) => dayjs().isBetween(point.dateFrom, dayjs(point.dateTo)),
};

const filters = {
  [FilterTypes.EVERYTHING]: (/** @type {Points} */points) => points,
  [FilterTypes.FUTURE]: (/** @type {Points} */points) => points.filter((/** @type {Point} */point) => filterСonditions[FilterTypes.FUTURE](point)),
  [FilterTypes.PAST]: (/** @type {Points} */points) => points.filter((/** @type {Point} */point) => filterСonditions[FilterTypes.PAST](point)),
  [FilterTypes.PRESENT]: (/** @type {Points} */points) => points.filter((/** @type {Point} */point) => filterСonditions[FilterTypes.PRESENT](point)),
};

export { filters, filterСonditions };

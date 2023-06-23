import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

//@ts-check
import { FilterTypes } from '../constants';

dayjs.extend(isBetween);

const filterСonditions = {
  [FilterTypes.EVERYTHING]: (point) => !!point,
  [FilterTypes.FUTURE]: (point) => dayjs().isBefore(dayjs(point.dateFrom)),
  [FilterTypes.PAST]: (point) => dayjs().isAfter(dayjs(point.dateTo)),
  [FilterTypes.PRESENT]: (point) => dayjs().isBetween(point.dateFrom, dayjs(point.dateTo)),
};

const filters = {
  [FilterTypes.EVERYTHING]: (points) => points,
  [FilterTypes.FUTURE]: (points) => points.filter((point) => filterСonditions[FilterTypes.FUTURE](point)),
  [FilterTypes.PAST]: (points) => points.filter((point) => filterСonditions[FilterTypes.PAST](point)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => filterСonditions[FilterTypes.PRESENT](point)),
};

export { filters, filterСonditions };

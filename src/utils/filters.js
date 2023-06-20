import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

//@ts-check
import { FilterTypes } from '../constants';

dayjs.extend(isBetween);

const filters = {
  [FilterTypes.EVERYTHING]: (points) => points,
  [FilterTypes.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.dateFrom))),
  [FilterTypes.PAST]: (points) => points.filter((point) => dayjs().isAfter(dayjs(point.dateTo))),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => dayjs().isBetween(point.dateFrom, dayjs(point.dateTo))),
};

export { filters };

const MIN_POINTS = 1;
const MAX_POINTS = 4;
const MAX_SELECT_OFFERS = 3;

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortTypes = {
  DEFAULT: 'day',
  POINT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const RENDER_DATE_FORMAT = 'MMM D';
const POINT_INFO_FORMAT = 'HH:mm';
const POINT_FORM_FORMAT = 'DD/MM/YY HH:mm';

export {
  FilterTypes,
  MAX_POINTS,
  MAX_SELECT_OFFERS,
  MIN_POINTS,
  POINT_FORM_FORMAT,
  POINT_INFO_FORMAT,
  RENDER_DATE_FORMAT,
  SortTypes,
  UpdateType,
  UserAction,
};

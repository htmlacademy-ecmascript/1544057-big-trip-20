const MIN_POINTS = 1;
const MAX_POINTS = 4;
const MAX_SELECT_OFFERS = 3;
const RENDER_DATE_FORMAT = 'MMM D';
const POINT_INFO_FORMAT = 'HH:mm';
const POINT_FORM_FORMAT = 'DD/MM/YY HH:mm';
const AUTHORIZATION = 'Basic original-pokemon-authorization';

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
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const Urls = {
  APP_API: 'https://20.objects.pages.academy/big-trip',
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

const ShakeTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const FieldClasses = {
  DESTINATION: 'event__input  event__input--destination',
  PRICE: 'event__input  event__input--price',
  OFFER: 'event__offer-checkbox  visually-hidden',
  TYPE: 'event__type',
  TIME: 'event__input event__input--time active flatpickr-input'
};

const ButtonClassNames = {
  RESET: 'event__reset-btn',
  SAVE: 'event__save-btn  btn  btn--blue',
  ROLLUP: 'event__rollup-btn'
};

export {
  AUTHORIZATION,
  ButtonClassNames,
  FieldClasses,
  FilterTypes,
  MAX_POINTS,
  MAX_SELECT_OFFERS,
  Method,
  MIN_POINTS,
  POINT_FORM_FORMAT,
  POINT_INFO_FORMAT,
  RENDER_DATE_FORMAT,
  ShakeTimeLimit,
  SortTypes,
  UpdateType,
  Urls,
  UserAction,
};

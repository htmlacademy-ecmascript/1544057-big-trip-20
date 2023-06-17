const MIN_EVENTS = 1;
const MAX_EVENTS = 4;
const MAX_SELECT_OFFERS = 3;

const FormTypes = {
  EDIT_FORM: 'editForm',
  ADD_FORM: 'addForm'
};

const FilterTypes = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};

const SortTypes = {
  DEFAULT: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const RENDER_DATE_FORMAT = 'MMM D';
const EVENT_INFO_FORMAT = 'HH:mm';
const EVENT_FORM_FORMAT = 'DD/MM/YY HH:mm';

export {
  EVENT_FORM_FORMAT,
  EVENT_INFO_FORMAT,
  FilterTypes,
  FormTypes,
  MAX_EVENTS,
  MAX_SELECT_OFFERS,
  MIN_EVENTS,
  RENDER_DATE_FORMAT,
  SortTypes,
};

const MIN_EVENTS = 0;
const MAX_EVENTS = 4;
const MAX_SELECT_OFFERS = 3;

const FormTypes = {
  EDIT_FORM: 'editForm',
  ADD_FORM: 'addForm'
};

const Filters = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past'
};

const RENDER_DATE_FORMAT = 'MMM D';
const EVENT_INFO_FORMAT = 'HH:mm';
const EVENT_FORM_FORMAT = 'DD/MM/YY HH:mm';

export {
  EVENT_FORM_FORMAT,
  EVENT_INFO_FORMAT,
  Filters,
  FormTypes,
  MAX_EVENTS,
  MAX_SELECT_OFFERS,
  MIN_EVENTS,
  RENDER_DATE_FORMAT,
};

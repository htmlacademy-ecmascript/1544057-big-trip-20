import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const humanizeDate = (date, dateformat) => date ? dayjs(date).format(dateformat) : '';

const calculateDuration = (start, stop) => {
  const eventTime = dayjs.duration(dayjs(stop) - dayjs(start), 'millisecond');

  if (eventTime.$d.days) {
    return eventTime.format('DD[d] HH[h] mm[M]');
  } else if (!eventTime.$d.days && eventTime.$d.hours) {
    return eventTime.format('HH[h] mm[M]');
  }
  return eventTime.format('mm[M]');

};

const getRandomInteger = (min = 1, max = 100) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getRandomIntGenerator = (min = 1, max = 100) => {
  const usedIds = new Set();

  return () => {
    let id;
    do {
      id = getRandomInteger(min, max);
    } while (usedIds.has(id));

    usedIds.add(id);
    return id;
  };
};

const checkEcsKeydownPress = (event, func, handkerFunc) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    func();
    document.removeEventListener('keydown', handkerFunc);
  }
};

export {
  calculateDuration,
  checkEcsKeydownPress,
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
  humanizeDate,
};

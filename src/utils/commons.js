//@ts-check
/**
 * @param {number} [min = 1] minimum value
 * @param {number} [max = 100] maximum value
 * @returns {number} random number
 */
const getRandomInteger = (min = 1, max = 100) => {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
};

/**
 *
 * @param {Array} elements
 * @returns {any} random element
 */
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

/**
 * @generator generete unique numbers
 * @param {number} [min = 1] min minimum value
 * @param {number} [max = 100] max maximum value
 * @yields {number} unique number
 */
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

/**
 * Проверяет объект KeyboardEvent на нажатие Esc
 * @param {KeyboardEvent} event
 * @param {function} func
 */
const checkEscKeydownPress = (event, func) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    func();
  }
};

/**@typedef {import('../mock/event-mock').EventObject} EventObject */

/**
 * Обновляет определенный элемент в массиве, по id элемента
 * @param {Array<object>} items
 * @param {any} update
 * @returns {Array<object>} new array of objects
 */
function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

/**
 * Поиск элемента в массиве, по id элемента
 * @param {Array} array
 * @param {any} id
 * @returns {any} finded object
 */
function findItemById(array, id) {
  return array.find((/** @type {{ id: any; }} */ item) => item.id === id);
}

export {
  checkEscKeydownPress,
  findItemById,
  getRandomArrayElement,
  getRandomInteger,
  getRandomIntGenerator,
  updateItem,
};

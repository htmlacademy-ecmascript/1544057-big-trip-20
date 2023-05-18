import { createElement } from '../../../../render.js';
import { getRandomInteger } from '../../../../utils.js';

const renderPhoto = (photoSrc) => `<img class="event__photo" src="${photoSrc}" alt="Event photo">'`;
const renderPhotos = () => {
  const photosLength = getRandomInteger(1, 5);
  const photos = [];

  for (let i = 1; i <= photosLength; i++) {
    photos.push(renderPhoto(`img/photos/${i}.jpg`));
  }
  return photos.join('\n');
};

const createEventFormDestinationTemplate = ({ description }) => `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${renderPhotos()}
                      </div>
                    </div>
                  </section>`;

export default class EventFormDestinationView {
  constructor(destination) {
    this.destination = destination;
  }

  getTemplate() {
    return createEventFormDestinationTemplate(this.destination);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

import { UpdateType, UserAction } from '../constants.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { pointId } from '../mock/points-mock.js';
import { checkEscKeydownPress } from '../utils/points.js';
import PointFormView from '../view/point/point-form-view.js';

export default class NewPointPresenter {
  #pointsListContainer;

  #handleDataChange;
  #handleDestroy;

  #newPointView;

  constructor({ pointsListContainer, onDataChange, onDestroy }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({ destinationsModel, offersModel }) {
    if (this.#newPointView) {
      return;
    }

    this.#newPointView = new PointFormView({
      destinations: destinationsModel.destinations,
      offersByTypes: offersModel.offers,
      onSubmitClick: this.#handleFormSubmit,
      onDeleteClick: this.#handleCanselClick
    });

    render(this.#newPointView, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#newPointView) {
      return;
    }
    this.#handleDestroy();

    remove(this.#newPointView);
    this.#newPointView = undefined;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { ...point, id: `point-${pointId()}` },
    );
    this.destroy();
  };

  #handleCanselClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (event) => {
    checkEscKeydownPress(event, () => {
      this.destroy();
    });
  };
}

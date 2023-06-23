import { UpdateType, UserAction } from '../constants.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { checkEscKeydownPress } from '../utils/points.js';
import PointFormView from '../view/point/point-form-view.js';

export default class NewPointPresenter {
  #pointsListContainer;

  #handleDataChange;
  #handleDestroy;

  #newPointComponent;

  constructor({ pointsListContainer, onDataChange, onDestroy }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({ destinationsModel, offersModel }) {
    if (this.#newPointComponent) {
      return;
    }

    this.#newPointComponent = new PointFormView({
      destinations: destinationsModel.destinations,
      offersByTypes: offersModel.offers,
      onSubmitClick: this.#handleFormSubmit,
      onDeleteClick: this.#handleCanselClick
    });

    render(this.#newPointComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#newPointComponent) {
      return;
    }

    remove(this.#newPointComponent);
    this.#newPointComponent = undefined;

    this.#handleDestroy();

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newPointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      { ...point },
    );
  };

  #handleCanselClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    checkEscKeydownPress(evt, () => {
      this.destroy();
    });
  };
}

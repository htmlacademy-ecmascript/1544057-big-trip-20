import { UpdateType, UserAction } from '../constants';
import { remove, render, RenderPosition } from '../framework/render';
import { checkEscKeydownPress } from '../utils/points';
import PointFormView from '../view/point/point-form-view';

export default class NewPointPresenter {
  #pointsListContainer;

  #handleDataChange;
  #handleDestroy;

  #newPointComponent;

  constructor({ pointsListContainer, handleDataChange, onDestroy }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = handleDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({ destinationsModel, offersModel }) {
    if (this.#newPointComponent) {
      return;
    }

    this.#newPointComponent = new PointFormView({
      destinations: destinationsModel.destinations,
      offersByTypes: offersModel.offers,
      handleSubmitClick: this.#handleFormSubmit,
      handleDeleteClick: this.#handleCanselClick
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

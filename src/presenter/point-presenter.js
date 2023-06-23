import { UpdateType, UserAction } from '../constants.js';
import { remove, render, replace } from '../framework/render.js';
import { checkEscKeydownPress } from '../utils/points.js';
import PointFormView from '../view/point/point-form-view.js';
import PointInfoView from '../view/point/point-info-view.js';

/** Пересентер события */
/**@typedef {import('./page-presenter.js').Point}  Point*/
/**@typedef {import('../model/offers-model.js').Offer} Offer */
/**@typedef {import('../model/destinations-model.js').default}  DestinationsModel*/
/**@typedef {import('../model/offers-model.js').default}  OffersModel*/

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsListContainer;
  #offersModel;
  #destinationsModel;
  /**@type{PointInfoView}*/
  #pointInfoComponent;
  /**@type{PointFormView}*/
  #pointFormComponent;
  #handleDataChange;
  #handleModeChange;
  /**@type{Point} */
  #point;
  #mode = Mode.DEFAULT;

  /**
   * @param {{pointsListContainer: HTMLElement, destinationsModel: DestinationsModel, offersModel: OffersModel, onDataChanged: function, onModeChange: function}} params
   */
  constructor({ pointsListContainer, destinationsModel, offersModel, onDataChanged, onModeChange }) {
    this.#pointsListContainer = pointsListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChanged;
    this.#handleModeChange = onModeChange;
  }

  /**
   * @param {Point} point
   */
  init(point) {
    this.#point = point;
    const prevInfoComponent = this.#pointInfoComponent;
    const prevFormComponent = this.#pointFormComponent;

    this.#pointInfoComponent = new PointInfoView({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      offersByType: this.#offersModel.offers,
      onEditButtonClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#ecsKeydownHandler);
      },
      onFavoriteClick: () => this.#handleFavoriteClick()
    });

    this.#pointFormComponent = new PointFormView({
      point: this.#point,
      destinations: this.#destinationsModel.destinations,
      offersByTypes: this.#offersModel.offers,
      onCancelClick: this.resetView,
      onSubmitClick: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if (!prevInfoComponent || !prevFormComponent) {
      render(this.#pointInfoComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointInfoComponent, prevInfoComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointInfoComponent, prevFormComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevInfoComponent);
    remove(prevFormComponent);
  }

  /**
   * Сбрасывает карточку на режим просмотра c сбросом state
   */
  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointFormComponent.reset(this.#point);
      this.#replaceFormToInfo();
    }
  };

  /**
  * Удаляет компонент
  */
  destroy() {
    remove(this.#pointInfoComponent);
    remove(this.#pointFormComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointInfoComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointFormComponent.shake(resetFormState);
  }

  /**
   * Переводит карточку на режим редактирования
   */
  #replacePointToForm = () => {
    replace(this.#pointFormComponent, this.#pointInfoComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  /**
   * Переводит карточку в режим просмотра
   */
  #replaceFormToInfo = () => {
    replace(this.#pointInfoComponent, this.#pointFormComponent);
    document.removeEventListener('keydown', this.#ecsKeydownHandler);
    this.#mode = Mode.DEFAULT;
  };

  /**
   * Обработчик нажатия ESCAPE
   * @param {KeyboardPoint} point
   */
  #ecsKeydownHandler = (evt) => {
    checkEscKeydownPress(evt, () => {
      this.resetView();
    });
  };

  /**
   * Обработчик клика по кнопке добавить в избранное
   */
  #handleFavoriteClick = () => {

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite });
  };

  /**
   * Обработчик сохранения данных формы
   * @param {Point} point
   */
  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...point });
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      { ...point });
  };

}

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
      onDeleteClick: this.#handlerDeleteClick
    });

    if (!prevInfoComponent || !prevFormComponent) {
      render(this.#pointInfoComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointInfoComponent, prevInfoComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointFormComponent, prevFormComponent);
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
  * Удаляет компонент
  */
  destroy() {
    remove(this.#pointInfoComponent);
    remove(this.#pointFormComponent);
  }

  /**
   * Обработчик нажатия ESCAPE
   * @param {KeyboardPoint} point
   */
  #ecsKeydownHandler = (event) => {
    checkEscKeydownPress(event, () => {
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
    if (point.id.trim().length < 1) {
      throw new Error('Нету функции добавления нового события');
    }

    if (point.dateFrom instanceof Date) {
      // В модели дата храниться в другом формате
    }

    this.#replaceFormToInfo();

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...point });
  };

  #handlerDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      { ...point });
  };

}

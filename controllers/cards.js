const httpConstants = require('http2').constants;
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const cardSchema = require('../models/card');

const getCards = (req, res, next) => cardSchema
  .find({})
  .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
  .catch((err) => next(err));

const postCard = (req, res, next) => {
  const id = req.user._id;
  const { name, link } = req.body;
  cardSchema
    .create({ name, link, owner: id })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  cardSchema
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(' Карточка с указанным _id не найдена.'));
      }
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return cardSchema.findByIdAndDelete(req.params.cardId)
        .then(() => res.status(httpConstants.HTTP_STATUS_OK).send({ message: 'Карточка удалена' }))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        next(new NotFoundError(' Карточка с указанным _id не найдена.'));
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(' Карточка с указанным _id не найдена.'));
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

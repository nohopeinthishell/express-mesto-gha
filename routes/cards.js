const router = require('express').Router();
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, cardIdValidation } = require('../validation/validation');

router.get('/', getCards);
router.post('/', createCardValidation, postCard);
router.delete('/:cardId', cardIdValidation, deleteCard);
router.put('/:cardId/likes', cardIdValidation, likeCard);
router.delete('/:cardId/likes', cardIdValidation, dislikeCard);
module.exports = router;

const router = require('express').Router();
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, cardIdValidation } = require('../validation/validation');

router.get('/cards', getCards);
router.post('/cards', createCardValidation, postCard);
router.delete('/cards/:cardId', cardIdValidation, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidation, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidation, dislikeCard);
module.exports = router;

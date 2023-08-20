const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateFunc,
  getUserMe,
} = require('../controllers/users');
const {
  userIdValidation, profileUpdateValidation, avatarUpdateValidation,
} = require('../validation/validation');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.patch('/me', profileUpdateValidation, updateFunc);
router.patch('/me/avatar', avatarUpdateValidation, updateFunc);
router.get('/:id', userIdValidation, getUserById);

module.exports = router;

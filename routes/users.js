const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');
const {
  userIdValidation, profileUpdateValidation, avatarUpdateValidation,
} = require('../validation/validation');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.patch('/me', profileUpdateValidation, updateUser);
router.patch('/me/avatar', avatarUpdateValidation, updateAvatar);
router.get('/:id', userIdValidation, getUserById);

module.exports = router;

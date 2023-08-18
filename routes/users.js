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
  userMeValidation,
} = require('../validation/validation');

router.get('/users', getUsers);
router.get('/users/me', userMeValidation, getUserMe);
router.patch('/users/me', profileUpdateValidation, updateUser);
router.patch('/users/me/avatar', avatarUpdateValidation, updateAvatar);
router.get('/users/:id', userIdValidation, getUserById);

module.exports = router;

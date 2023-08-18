const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const { userIdValidation, profileUpdateValidation, avatarUpdateValidation } = require('../validation/validation');

router.get('/users', getUsers);
router.get('/users/me', userIdValidation, getUserById);
router.patch('/users/me', profileUpdateValidation, updateUser);
router.patch('/users/me/avatar', avatarUpdateValidation, updateAvatar);

module.exports = router;

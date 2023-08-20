const router = require('express').Router();
const usersRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardRouter);

module.exports = router;

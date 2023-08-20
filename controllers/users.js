const httpConstants = require('http2').constants;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const UnautorizedError = require('../errors/unauthorizedError');
const ForbiddenError = require('../errors/forbiddenError');
const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');

const salt = bcrypt.genSaltSync(10);

const getUsers = (req, res, next) => userSchema
  .find({})
  .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
  .catch((err) => next(err));

const getUser = (req, res, next, id) => {
  userSchema
    .findById(id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError(err.message));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  getUser(req, res, next, id);
};

const getUserMe = (req, res, next) => {
  const id = req.user._id;
  getUser(req, res, next, id);
};

const updateFunc = (req, res, next) => {
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, salt)
    .then((hash) => userSchema
      .create({
        name, about, avatar, email, password: hash,
      }))
    .then((data) => {
      const userResponse = data.toObject();
      delete userResponse.password;
      res.status(httpConstants.HTTP_STATUS_CREATED).send(userResponse);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Данный email уже зарегистрирован'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userSchema.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnautorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password, (err, isValid) => {
        if (!isValid) {
          return next(new UnautorizedError('Неправильные почта или пароль'));
        }
        const token = jwt.sign(
          { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
        );
        return res.status(httpConstants.HTTP_STATUS_OK).send({ token });
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateFunc,
  login,
  getUserMe,
};

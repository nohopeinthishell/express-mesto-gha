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

const getUserById = (req, res, next) => {
  userSchema
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

const getUserMe = (req, res, next) => {
  userSchema
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    next(new ValidationError('Email или пароль не могуть быть пустыми'));
  }

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
        next(new ValidationError(err.message));
      }
      if (err.code === 11000) {
        next(new ConflictError('Данный email уже зарегистрирован'));
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
      },
    )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ValidationError('Email или пароль не могуть быть пустыми'));
  }

  userSchema.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnautorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password, (err, isValid) => {
        if (!isValid) {
          next(new UnautorizedError('Неправильные почта или пароль'));
        }
        const token = jwt.sign(
          { _id: user._id },
          'some-secret-key',
          { expiresIn: '7d' },
        );
        res.cookie('jwt', token, { httpOnly: true });
        return res.status(httpConstants.HTTP_STATUS_OK).send({ token });
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserMe,
};

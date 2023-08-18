const { celebrate, Joi } = require('celebrate');

const REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~H?&/=]*)$/;

const userIdValidation = celebrate({
  params: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().length(24).required(),
    }),
  }),
});

const registerValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().max(30)
      .min(2),
    password: Joi.string().required().max(30).min(2),
    avatar: Joi.string().pattern(REGEX),
  }).unknown(true),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().max(30)
      .min(2),
    password: Joi.string().required().max(30).min(2),
  }),
});

const avatarUpdateValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(REGEX),
  }),
});

const profileUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().alphanum().max(30)
      .min(2),
    about: Joi.string().required().alphanum().max(30)
      .min(2),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().pattern(REGEX),
  }),
});

module.exports = {
  userIdValidation,
  registerValidation,
  loginValidation,
  avatarUpdateValidation,
  profileUpdateValidation,
  cardIdValidation,
  createCardValidation,
};

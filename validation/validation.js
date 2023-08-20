const { celebrate, Joi } = require('celebrate');

const REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~H?&/=]*)$/;

const userIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).required().hex(),
  }),
});

const registerValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(2)
      .max(30),
    password: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(REGEX),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),

  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(2)
      .max(30),
    password: Joi.string().required().min(2).max(30),
  }),
});

const avatarUpdateValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(REGEX).required(),
  }),
});

const profileUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2)
      .max(30),
    about: Joi.string().required().min(2)
      .max(30)
    ,
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required().hex(),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(REGEX).required(),
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

const httpConstants = require('http2').constants;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const {
  createUser,
  login,
} = require('./controllers/users');
const errorHandler = require('./middlewares/errror-handler');
const { loginValidation, registerValidation } = require('./validation/validation');
const NotFoundError = require('./errors/notFoundError');

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connected to db');
  });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', loginValidation, login);
app.post('/signup', registerValidation, createUser);

app.use(auth);

app.use(router);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

const httpConstants = require('http2').constants;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

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

app.use((req, res, next) => {
  req.user = {
    _id: '64cca7f031b1d7c310800a59',
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

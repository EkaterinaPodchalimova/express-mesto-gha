const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const {
  celebrate, Joi, Segments, errors,
} = require('celebrate');
const NotFoundError = require('./errors/not-found-error');
const { postUsers, login } = require('./controllers/users');
const { STATUS_500 } = require('./utils/constants');

const { MONGOOSE_ENV } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGOOSE_ENV);

app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().pattern(/(http|https):\/\/([\w.]+\/?)\S*/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), postUsers);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());
app.use((err, req, res, next) => {
  const { status = STATUS_500, message } = err;
  res
    .status(status)
    .send({
      message: (status === STATUS_500)
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);

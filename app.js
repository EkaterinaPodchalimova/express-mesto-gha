const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate, Joi, Segments, errors,
} = require('celebrate');
const { ERROR_CODE_404 } = require('./utils/constants');
const { postUsers, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

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

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use((req, res, next) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница не найдена' });
  next();
});

app.listen(PORT);

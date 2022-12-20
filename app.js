const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_CODE_404 } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

const { postUsers, login } = require('./controllers/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', postUsers);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница не найдена' });
  next();
});

app.listen(PORT);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    id: '6392321d684dbbb419ae5fb7',
  };
  next();
});
app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена' });
  next();
});

app.listen(PORT);

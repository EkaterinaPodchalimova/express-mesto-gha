const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {PORT = 3000} = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(( req, res, next) => {
  req.user = {
    _id: '6392321d684dbbb419ae5fb7'
  };
  next();
});
app.use((err,res,next) => {
  if (err) {
    return res.status(404).send({message: `Некоректный путь`})
  } else {
    next()
  }
})
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(PORT);
});



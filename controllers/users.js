const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(() => res.status(500).send({message: 'Произошла ошибка'}));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then(users => res.send({data: users}))
    .catch(err => {
        if (err.name === 'CastError') {
          return res.status(400).send({message: 'Пользователь по указанному _id не найден'})
        } else {
          return res.status(500).send({message: `Произошла ошибка`})
        }
      })
};

module.exports.postUsers = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные при создании пользователя.'})
      } else {
        return res.status(500).send({message: `Произошла ошибка`})
      }
    })
};

module.exports.editUsers = (req, res) => {
  const {name, about} = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные при обновлении профиля.'})
      }
      if (err.name === 'CastError') {
        return res.status(404).send({message: 'Пользователь по указанному _id не найден'})
      } else {
        return res.status(500).send({message: `Произошла ошибка ${err.name}`})
      }
    })
};

module.exports.editAvatar = (req, res) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, {avatar}, {runValidators: true, new: true})
    .then(user => res.send({data: user}))
    .catch((err) => {
      if ('string' !== typeof avatar) {
        return res.status(400).send({message: `Переданы некорректные данные при обновлении аватара.`})
      }
      if (err.name === 'CastError') {
        return res.status(404).send({message: `Пользователь по указанному _id не найден`})
      } else {
        return res.status(500).send({message: `Произошла ошибка ${err.name}`})
      }
    })
};
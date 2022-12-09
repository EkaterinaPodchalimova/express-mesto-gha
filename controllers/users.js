const User = require('../models/user');
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (users == null) {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name}` });
    });
};

module.exports.postUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.editUsers = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user == null) {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name}` });
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.id, { avatar }, { runValidators: true, new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name}` });
    });
};

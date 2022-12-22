const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_409, ERROR_CODE_500, STATUS_201,
} = require('../utils/constants');

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

module.exports.getUserNow = (req, res) => {
  User.findById(req.user._id)
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name}` }));
};

module.exports.postUsers = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(STATUS_201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(ERROR_CODE_409).send({ message: 'Пользователь с таким email уже существует' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.editUsers = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user == null) {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name}` });
    });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name}` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

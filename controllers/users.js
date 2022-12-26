const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'dev-key' } = process.env;

const { STATUS_201 } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const AlreadyExistsError = require('../errors/already-exist-error');
const EditError = require('../errors/edit-error');
const LoginError = require('../errors/login-error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (users == null) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.send({ data: users });
    })
    .catch(next);
};

module.exports.getUserNow = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.postUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
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
        next(new AlreadyExistsError('Пользователь с таким email уже существует'));
      }
    });
};

module.exports.editUsers = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new EditError('Пользователь по указанному _id не найден'))
    .then((user) => {
      if (user == null) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(new EditError('Пользователь по указанному _id не найден'))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch((err) => next(new LoginError(err.message)));
};

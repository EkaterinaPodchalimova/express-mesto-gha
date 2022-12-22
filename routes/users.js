const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUsersById, getUserNow, editUsers, editAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, getUsers);
router.get('/:userId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, getUsersById);
router.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, getUserNow);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, editUsers);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(true),
}), auth, editAvatar);

module.exports = router;

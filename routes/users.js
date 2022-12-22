const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers, getUsersById, getUserNow, editUsers, editAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, getUsers);
router.get('/:userId', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, getUsersById);
router.get('/me', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, getUserNow);
router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, editUsers);
router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().uri().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, editAvatar);

module.exports = router;

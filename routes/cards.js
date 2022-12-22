const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCard, deleteCardsById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, getCard);
router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, deleteCardsById);
router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/(http|https):\/\/([\w.]+\/?)\S*/).required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, createCard);
router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, likeCard);
router.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), auth, dislikeCard);

module.exports = router;

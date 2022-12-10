const {
  ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500, STATUS_201,
} = require('../utils/constants');
const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardsById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card == null) {
        return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'Некоректные данные _id карточки.' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, owner: req.user._id, link })
    .then((card) => res.status(STATUS_201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  {
    $addToSet: { likes: req.user._id },
  },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => {
    if (card == null) {
      return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
    return res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.status}` });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  {
    $pull: { likes: req.user._id },
  },
  { new: true },
)
  .populate(['owner', 'likes'])
  .then((card) => {
    if (card == null) {
      return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для снятии лайка. ' });
    }
    return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
  });

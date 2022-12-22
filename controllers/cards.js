const {
  ERROR_CODE_404, ERROR_CODE_500, STATUS_201, ERROR_CODE_403,
} = require('../utils/constants');
const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardsById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card == null) {
        return res.status(ERROR_CODE_404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (!(card.owner._id.toString() === req.user._id)) {
        return res.status(ERROR_CODE_403).send({ message: 'Вы не можете удалить чужую карточку!' });
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .then((cardDelete) => res.send({ data: cardDelete }))
        .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' }));
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, owner: req.user._id, link })
    .then((card) => res.status(STATUS_201).send({ data: card }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' }));
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
  .catch((err) => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.status}` }));

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
  .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' }));

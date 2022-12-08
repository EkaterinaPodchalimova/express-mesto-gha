const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then(card => res.send({data: card}))
    .catch((err) => res.status(500).send({message: 'Произошла ошибка'}));
};

module.exports.deleteCardsById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send('Карточка удалена!'))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({message: 'Карточка с указанным _id не найдена.'})
      } else {
        return res.status(500).send({message: 'Произошла ошибка'})
      }
    });
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, owner: req.user._id, link})
    .then(card => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные при создании карточки.'})
      } else {
        return res.status(500).send({message: 'Произошла ошибка'})
      }
    });
};

module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true, runValidators: true})
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({message: 'Передан несуществующий _id карточки.'})
      } else {
        return res.status(500).send({message: `Произошла ошибка ${err.status}`})
      }
    });

module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true, runValidators: true},)
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные для постановки/снятии лайка.'})
      }
      if (err.name === 'CastError') {
        return res.status(404).send({message: 'Передан несуществующий _id карточки.'})
      } else {
        return res.status(500).send({message: 'Произошла ошибка'})
      }
    });


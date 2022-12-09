const router = require('express').Router();
const {
  getCard, deleteCardsById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCard);
router.delete('/:cardId', deleteCardsById);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;

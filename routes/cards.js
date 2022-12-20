const router = require('express').Router();
const {
  getCard, deleteCardsById, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', auth, getCard);
router.delete('/:cardId', auth, deleteCardsById);
router.post('/', auth, createCard);
router.put('/:cardId/likes', auth, likeCard);
router.delete('/:cardId/likes', auth, dislikeCard);

module.exports = router;

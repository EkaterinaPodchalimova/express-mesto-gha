const router = require('express').Router();
const {
  getUsers, getUsersById, getUserNow, editUsers, editAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/:userId', auth, getUsersById);
router.get('/me', auth, getUserNow)
router.patch('/me', auth, editUsers);
router.patch('/me/avatar', auth, editAvatar);

module.exports = router;

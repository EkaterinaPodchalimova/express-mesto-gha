const router = require('express').Router();
const {
  getUsers, getUsersById, postUsers, editUsers, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.post('/', postUsers);
router.patch('/me', editUsers);
router.patch('/me/avatar', editAvatar);

module.exports = router;

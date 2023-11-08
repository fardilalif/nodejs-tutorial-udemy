const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController.js');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authentication.js');

router.get(
  '/',
  authenticateUser,
  authorizePermissions('admin', 'owner'),
  getAllUsers
);
router.get('/showMe', authenticateUser, showCurrentUser);
router.patch('/updateUser', authenticateUser, updateUser);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);
router.get('/:id', authenticateUser, getSingleUser);

module.exports = router;

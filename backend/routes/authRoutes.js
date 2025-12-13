const express = require('express');
const router = express.Router();
const { register, login, updateProfile, updatePassword, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;

const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/socialauth', authController.socialAuth);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify', authController.verify);
router.get('/logout', authController.logout);

module.exports = router;

const express = require('express');
const router = express.Router();

const AuthController = require('../controller/auth');

router.post('/', AuthController.login);

router.post('/signup', AuthController.signup);

module.exports = router;
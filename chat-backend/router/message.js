const express = require('express');
const router = express.Router();

const is_Auth = require('../middleware/is_auth');
const MessageController = require('../controller/message');

router.post('/send', is_Auth, MessageController.createMessage);

router.get('/messages', is_Auth, MessageController.getMessages);

module.exports = router;
const express = require('express');
const router = express.Router();

const UserController = require('../controller/user');
const is_Auth = require('../middleware/is_auth');

router.post('/addContact', is_Auth, UserController.addContact);
router.get('/users', is_Auth, UserController.getUsers);
router.get('/contacts', is_Auth, UserController.getContacts);
router.get('/details', is_Auth, UserController.getDetails);
router.get('/getImage', is_Auth, UserController.getImage);
router.get('/media', is_Auth, UserController.getMedia);

module.exports = router;
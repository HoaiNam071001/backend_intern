const express = require('express');
const router = express.Router();
const user = require('../api/user');

router.post('/login', user.login);
router.post('/', user.register);
module.exports = router;

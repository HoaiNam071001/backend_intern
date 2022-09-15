const express = require('express');
const router = express.Router();
const user = require('../api/user');
const { VerifyToken } = require('../middleware/Token');

router.get('/', VerifyToken, user.getCurrentUser);
router.put('/', VerifyToken, user.updateCurrentUser);
module.exports = router;

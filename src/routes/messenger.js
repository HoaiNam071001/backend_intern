const express = require('express');
const router = express.Router();
const messenger = require('../api/messenger');
const { VerifyToken } = require('../middleware/Token');

router.post('/user', VerifyToken, messenger.getMessByUser);
router.post('/room', VerifyToken, messenger.getMessByRoom);
router.post('/create', messenger.createMess);
router.get('/', VerifyToken, messenger.getRooms);

module.exports = router;

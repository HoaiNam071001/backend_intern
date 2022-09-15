const express = require('express');
const router = express.Router();
const defaults = require('../api/default');
const { CheckToken } = require('../middleware/Token');

router.get('/tags', defaults.getTags);
router.get('/search', CheckToken, defaults.Search);

module.exports = router;

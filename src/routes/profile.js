const express = require('express');
const router = express.Router();
const profile = require('../api/profile');
const { CheckToken, VerifyToken } = require('../middleware/Token');

router.post('/:username/follow', VerifyToken, profile.followUser);
router.delete('/:username/follow', VerifyToken, profile.unfollowUser);
router.get('/:username', CheckToken, profile.getprofile);

module.exports = router;

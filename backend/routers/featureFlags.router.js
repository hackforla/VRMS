const express = require('express');
const router = express.Router();
const FeatureFlagsController = require('../controllers/featureFlags.controller');
const { AuthUtil } = require('../middleware');

router.get('/', AuthUtil.addCookieIfAvailable, FeatureFlagsController.index);

module.exports = router;

const express = require('express');
const router = express.Router();
const FeatureFlagsController = require('../controllers/featureFlags.controller');

const { Auth } = require('../middleware');

router.get('/', Auth.addCookieIfAvailable, FeatureFlagsController.index);

module.exports = router;

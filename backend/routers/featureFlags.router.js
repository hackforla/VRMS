const express = require('express');
const router = express.Router();
const FeatureFlagsController = require('../controllers/featureFlags.controller');

router.get('/', FeatureFlagsController.index);

module.exports = router;
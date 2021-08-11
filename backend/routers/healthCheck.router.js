const express = require("express");
const router = express.Router();

const { HealthCheckController } = require('../controllers');

// The root is /api/healthcheck
router.get('/', HealthCheckController.isAlive);

module.exports = router;

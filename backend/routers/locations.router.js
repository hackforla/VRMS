const express = require("express");
const router = express.Router();

const { LocationController } = require('../controllers');

// The root is /api/locations
router.get('/', LocationController.location_list);
router.post('/', LocationController.create);

module.exports = router;

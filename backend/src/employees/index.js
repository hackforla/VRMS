const express = require("express");
const router = express.Router();

const { getAll } = require("./getAll");

// return all records
router.get('/', getAll);

module.exports = router;
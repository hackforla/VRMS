const express = require("express");
const router = express.Router();

const { authHandler } = require("../middleware");
const { getMe } = require("./getMe");
const { create } = require("./create");

// apply auth middleware to all endpoints
router.use("/", authHandler);

// return account for current user
router.get('/self', getMe);

// create a new user
router.post("/", create);

module.exports = router;
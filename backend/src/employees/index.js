const express = require("express");
const router = express.Router();

const { authHandler } = require("../middleware");

const { getAll } = require("./getAll");

// return all records
router.get('/', getAll);

router.use("/auth", authHandler);
router.get("/auth", (req, res) => {
  res.send("authenticated end point.  " + JSON.stringify(req?.locals?.user));
})

router.get("/open", (_, res) => {
  res.send("unauthenticated end point");
});

module.exports = router;
const express = require("express");
const router = express.Router();

const { ProjectTeamMember } = require('../models/projectTeamMember.model');

// GET /api/projectteammembers/
router.get("/", (req, res) => {
  ProjectTeamMember.find()
    .populate("userId")
    .then((teamMembers) => {
      return res.status(200).send(teamMembers);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});

router.get("/:id", (req, res) => {
  ProjectTeamMember.find({ projectId: req.params.id })
    .populate("userId")
    .then((teamMembers) => {
      return res.status(200).send(teamMembers);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});

router.get("/project/:id/:userId", (req, res) => {
  ProjectTeamMember.find({
    projectId: req.params.id,
    userId: req.params.userId,
  })
    .populate("userId")
    .then((teamMember) => {
      if (!teamMember.length) {
        return res.sendStatus(400);
      } else {
        return res.status(200).send(teamMember);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});

router.get("/projectowner/:id", (req, res) => {
  const id = req.params.id;

  ProjectTeamMember.findOne({ userId: id })
    .populate("userId")
    .populate("projectId")
    .then((teamMember) => {
      teamMember.vrmsProjectAdmin === true
        ? res.status(200).send(teamMember)
        : res.status(200).send(false);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/", (req, res) => {
  ProjectTeamMember.create(req.body)
    .then((teamMember) => {
      return res.status(201).send(teamMember);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});

router.patch("/:id", (req, res) => {
  // const { headers } = req;
  // const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

  // if (headers['x-customrequired-header'] !== expectedHeader) {
  //     res.sendStatus(401);
  // } else {
  ProjectTeamMember.findByIdAndUpdate(req.params.id, req.body)
    .then((edit) => res.json(edit))
    .catch((err) =>
      res.sendStatus(400));
  // };
});

module.exports = router;

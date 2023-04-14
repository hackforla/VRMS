const { Event } = require('../models');

const EventController = {};

EventController.event_list = async function (req, res) {
  const { query } = req;

  try {
    const events = await Event.find(query).populate('project');
    return res.status(200).send(events);
  } catch (err) {
    return res.sendStatus(400);
  }
};

EventController.event_by_id = async function (req, res) {
  const { EventId } = req.params;

  try {
    const events = await Event.findById(EventId).populate('project');
    return res.status(200).send(events);
  } catch (err) {
    return res.sendStatus(400);
  }
};

EventController.create = async function (req, res) {
  const { body } = req;

  try {
    const event = await Event.create(body);
    return res.status(201).send(event);
  } catch (err) {
    return res.sendStatus(400);
  }
};

EventController.destroy = async function (req, res) {
  const { EventId } = req.params;

  try {
    const event = await Event.findByIdAndDelete(EventId);
    return res.status(200).send(event);
  } catch (err) {
    return res.sendStatus(400);
  }
};

EventController.update = async function (req, res) {
  const { EventId } = req.params;

  try {
    const event = await Event.findByIdAndUpdate(EventId, req.body);
    return res.status(200).send(event);
  } catch (err) {
    return res.sendStatus(400);
  }
};

module.exports = EventController;

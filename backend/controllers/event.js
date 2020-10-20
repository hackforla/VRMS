const { Event } = require('../models');

const EventController = {};

EventController.event_list = function (req, res) {
  const { query } = req;

  try {
    const events = await Event.find(query).exec();
    res.json(events);
  } catch (err) {
    res.sendStatus(500).json({
      message: `/GET Internal server error: ${err.stack}`,
    });
  }
};

EventController.event_by_id = async function (req, res) {
  const { id } = req.params;

  try {
    const events = await Event.findById(id).populate('project');
    res.json(events);
  } catch (err) {
    res.sendStatus(500).json({
      message: `/GET Internal server error: ${err}`,
    });
  }
};

EventController.create = function (req, res) {
  res.send('NOT IMPLEMENTED: Event create POST');
};

EventController.destroy = function (req, res) {
  res.send('NOT IMPLEMENTED: Event destroy POST');
};

EventController.update = function (req, res) {
  res.send('NOT IMPLEMENTED: Event list UPDATE');
};

module.exports = EventController;

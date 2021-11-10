const { RecurringEvent } = require('../models');

const RecurringEventController = {};

RecurringEventController.destroy = async function (req, res) {
	const { RecurringEventID } = req.params;
      
	try {
	  const rEvent = await RecurringEvent.findByIdAndDelete(RecurringEventID);
	  return res.status(200).send(rEvent);
	} catch (err) {
	  return res.sendStatus(400);
	}
      };

module.exports = RecurringEventController;
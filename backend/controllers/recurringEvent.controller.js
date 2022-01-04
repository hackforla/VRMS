const { RecurringEvent } = require('../models');
const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

const RecurringEventController = {};

// Update Recurring Event
RecurringEventController.update = async function (req, res) {
	const { headers } = req;
	const { RecurringEventId } = req.params;

	if (headers['x-customrequired-header'] !== expectedHeader) {
    return res.sendStatus(403);
  }

  try {
    const rEvent = await RecurringEvent.findOneAndUpdate({_id: RecurringEventId}, req.body, {new: true});
    return res.status(200).send(rEvent);
  } catch (err) {
    return res.sendStatus(400);
  }
};


// Delete Recurring Event
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
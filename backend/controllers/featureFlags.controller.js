const { getAllFlags } = require('../services/featureFlags.service.js');

const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

const FeatureFlagsController = {};

FeatureFlagsController.index = async function (req, res) {
    const { headers } = req;

    if (headers['x-customrequired-header'] !== expectedHeader) {
        return res.sendStatus(403);
    }

    try {
        const flags = await getAllFlags("default");
        return res.status(200).json(flags);
    } catch (err) {
        console.error(err);
        return res.sendStatus(400);
    }
};

module.exports = FeatureFlagsController;
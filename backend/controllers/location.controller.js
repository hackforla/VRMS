const { LocationService } = require('../services');

const LocationController = {};

LocationController.location_list = async (req, res, next) => {
    await LocationService
        .getAll()
        .then(locations => res.status(200).json(locations))
        .catch(next);
}

LocationController.create = async (req, res, next) => {
    await LocationService
        .add(req.body.locations)
        .then(() => res.status(201).json())
        .catch(next);
}

module.exports = LocationController;

const { LocationService } = require('../services');

const LocationController = {};

LocationController.location_list = async (req, res, next) => {
    try {
        const locations = await LocationService.getAll();
        return res.status(200).json(locations);
    } catch (error) {
        next(error)
    }
}

LocationController.create = async (req, res, next) => {
    try {
        await LocationService.add(req.body.locations);
        return res.status(201).json();
    } catch (error) {
        next(error)
    }
}

module.exports = LocationController;

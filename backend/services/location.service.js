/* eslint-disable func-names */
const { Location } = require('../models/dictionaries/location.model');
const DatabaseError = require('../errors/database.error');

const LocationService = {};

LocationService.add = async function (locations) {
  try {
    await Location.findOneAndUpdate(
      {},
      {
        $addToSet: { locations: { $each: locations } },
      },
      {new:true, upsert: true, runValidators: true, context: 'query' },
    );
  } catch (error) {
    throw new DatabaseError(error.message);
  }
};

LocationService.getAll = async function () {
  const result = await Location.findOne();
  if (result != null) return result.locations;
  return [];
};

module.exports = LocationService;

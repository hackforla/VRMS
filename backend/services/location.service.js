/* eslint-disable func-names */
const { Location } = require('../models/dictionaries/location.model');
const DatabaseError = require('../errors/database.error');
const ValidationError = require('../errors/validation.error');

const LocationService = {};

function validateLocations(locationsarray){

  if(!Array.isArray(locationsarray)){
    throw ValidationError("locations input must be of type array");
  }
  if(locationsarray.length  === 0){
    throw ValidationError("locations input array must have at least one element");
  }
  if( !locationsarray.every(item => (typeof item === "string")) ){
    throw ValidationError("locations array must be an array of strings");
  }
  if( !locationsarray.every( (element) => { if(element){return true} } )){
    throw ValidationError("locations array should not contain empty strings")
  }


}
LocationService.add = async function (locations) {
  try{

    validateLocations(locations);
    await Location.findOneAndUpdate(
      {},
      {
        $addToSet: { locations: { $each: locations } },
      },
      {new:true, upsert: true, context: 'query' },
    );

  }
  catch(error){
    throw new DatabaseError(error);
  }

};

LocationService.getAll = async function () {
  const result = await Location.findOne();
  if (result != null) return result.locations;
  return [];
};

module.exports = LocationService;

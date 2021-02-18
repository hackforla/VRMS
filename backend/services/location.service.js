/* eslint-disable func-names */
const { Location } = require('../models/dictionaries/location.model');
const DatabaseError = require('../errors/database.error');

const LocationService = {};

LocationService.add = async function (locations) {
    
    if(locations.length !== 0)
    {
        const valid = locations.every((r) => { 

            if(r != null)
            {
                if (r.trim().length > 0)
                {
                    return true;
                }  
            }
            return false; 
        });

        if(valid)
        {
            const dbRecord = await Location.findOne();

            if(dbRecord != null)
            {
                const existingLocations = dbRecord.locations;
                
                let newArray = existingLocations.concat(locations);
                
                // de-duplicate array
                newArray = [...new Set([...existingLocations,...locations])]

                dbRecord.locations = newArray;

                try {
                    await Location.replaceOne({}, dbRecord);
                } catch (error) {
                throw new DatabaseError(error.message);
              }
            }
            else 
            {
                try {
                    await Location.create({locations});
                } 
                catch (error) {
                    throw new DatabaseError(error.message);
                }
            }
        }

       

    }  

}

LocationService.getAll = async function () {
    
    const result = await Location.findOne();
    if(result != null)
        return result.locations;
    return [];

}

module.exports = LocationService;

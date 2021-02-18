/* eslint-disable func-names */
const { JobRole } = require('../models/dictionaries/jobRole.model');
const DatabaseError = require('../errors/database.error');

const JobRoleService = {};

JobRoleService.add = async function (roles) {
    
    if(roles.length !== 0)
    {
        const valid = roles.every((r) => { 

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
            const dbRecord = await JobRole.findOne();

            if(dbRecord != null)
            {
                const existingRoles = dbRecord.roles;
                
                let newArray = existingRoles.concat(roles);
                
                // de-duplicate array
                newArray = [...new Set([...existingRoles,...roles])]

                dbRecord.roles = newArray;

                try {
                    await JobRole.replaceOne({}, dbRecord);
                } catch (error) {
                throw new DatabaseError(error.message);
              }
            }
            else 
            {
                try {
                    await JobRole.create({roles});
                } 
                catch (error) {
                    throw new DatabaseError(error.message);
                }
            }
        }

       

    }  

}

JobRoleService.getAll = async function () {
    
    const result = await JobRole.findOne();
    if(result != null)
        return result.roles;
    return [];

}

module.exports = JobRoleService;

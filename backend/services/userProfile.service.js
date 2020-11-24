/* eslint-disable func-names */
const mongoose = require('mongoose');
const UserProfile = require('../models/userProfile.model');
const modificationLogService = require('./modificationLog.service');
const DatabaseError = require('../errors/database.error');
const DomainError = require('../errors/domain.error');

const UserProfileService = {};

UserProfileService.createUser = async function (userProfileData, authorEmail) {
    
    let newRecord = null;
    
    if(Object.prototype.hasOwnProperty.call(userProfileData, "signupEmail") &&
        userProfileData.signupEmail) {
        userProfileData.signupEmail = userProfileData.signupEmail.toLowerCase();
    }

    await mongoose.connection.transaction(async () => {
    
        try 
        {
            newRecord = await UserProfile.create(userProfileData);

            await modificationLogService.saveLog(authorEmail, 
                newRecord._id, "UserProfile", newRecord );    
        }
        catch(error)
        {
            throw new DatabaseError(error);
        }
             
    });

    return newRecord;
    
}


UserProfileService.updateUser = async function (userProfileData, authorEmail) {
    

    let updatedUserProfile = null;

    if(Object.prototype.hasOwnProperty.call(userProfileData, "signupEmail") &&
        userProfileData.signupEmail) 
    {
        userProfileData.signupEmail = userProfileData.signupEmail.toLowerCase();
    }

    await mongoose.connection.transaction(async () => {
    
        try
        {            
            updatedUserProfile = await UserProfile.findOneAndUpdate(
                {signupEmail: userProfileData.signupEmail}, 
                userProfileData, {new: true, runValidators: true});
    
            if(updatedUserProfile != null) 
            {
                await modificationLogService.saveLog(authorEmail, 
                    updatedUserProfile._id, "UserProfile", updatedUserProfile );    
            }
            else
            {
                throw new DatabaseError(new DomainError("User Profile Not Found"));
            }
        }
        catch(error)
        {
           throw new DatabaseError(error);
        }
       
                  
    });

    return updatedUserProfile;


  
    
}

UserProfileService.getUser = async function (id) {

    const result = await UserProfile.findById(id); 
    return result;
}

UserProfileService.getUserByEmail = async function (email) {

    const result = await UserProfile.findOne({signupEmail: email.toLowerCase()}); 
    return result;
}

module.exports = UserProfileService;


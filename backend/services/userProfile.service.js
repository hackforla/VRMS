/* eslint-disable func-names */
const mongoose = require('mongoose');
const UserProfile = require('../models/userProfile.model');
const modificationLogService = require('./modificationLog.service');

const UserProfileService = {};

UserProfileService.createUser = async function (userProfileData) {
    
    let newRecord = null;
    
    const inputData = userProfileData;

    if(Object.prototype.hasOwnProperty.call(inputData, "signupEmail") &&
        inputData.signupEmail) {
        inputData.signupEmail = userProfileData.signupEmail.toLowerCase();
    }

    await mongoose.connection.transaction(async () => {
    
        newRecord = await UserProfile.create(inputData);

        await modificationLogService.saveLog(newRecord.signupEmail, 
            newRecord._id, "UserProfile", newRecord );          
    });

    return newRecord;
    
}


UserProfileService.updateUser = async function (signupEmail, userProfileData) {
    

    let updatedUserProfile = null;

    // Don't allow updating of email address
    delete userProfileData.signupEmail;

    await mongoose.connection.transaction(async () => {
    
        updatedUserProfile = await UserProfile.findOneAndUpdate(signupEmail, 
            userProfileData, {new: true, runValidators: true});

        await modificationLogService.saveLog(updatedUserProfile.signupEmail, 
            updatedUserProfile._id, "UserProfile", updatedUserProfile );          
    });

    

    return updatedUserProfile;
    
}

UserProfileService.getUser = async function (id) {

    const results = await UserProfile.findById(id); 
    return results;
}

UserProfileService.getUserByEmail = async function (email) {

    const results = await UserProfile.findOne({signupEmail: email}); 
    return results;
}

module.exports = UserProfileService;

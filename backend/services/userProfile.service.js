/* eslint-disable func-names */
const mongoose = require('mongoose');
const UserProfile = require('../models/userProfile.model');
const modificationLogService = require('./modificationLog.service');

const UserProfileService = {};

UserProfileService.createUser = async function (userProfileData, authorEmail) {
    
    let newRecord = null;

    const inputData = userProfileData;

    if(Object.prototype.hasOwnProperty.call(inputData, "signupEmail") &&
        inputData.signupEmail) {
        inputData.signupEmail = userProfileData.signupEmail.toLowerCase();
    }

    await mongoose.connection.transaction(async () => {
    
        newRecord = await UserProfile.create(inputData);

        await modificationLogService.saveLog(authorEmail, 
            newRecord._id, "UserProfile", newRecord );          
    });

    return newRecord;
    
}


UserProfileService.updateUser = async function (signupEmail, userProfileData, authorEmail) {
    

    let updatedUserProfile = null;

    const inputData = userProfileData;

    // Don't allow updating of email address
    delete inputData.signupEmail;

    await mongoose.connection.transaction(async () => {
    
        updatedUserProfile = await UserProfile.findOneAndUpdate(signupEmail, 
            inputData, {new: true, runValidators: true});

        await modificationLogService.saveLog(authorEmail, 
            updatedUserProfile._id, "UserProfile", updatedUserProfile );          
    });

    

    return updatedUserProfile;
    
}

UserProfileService.getUser = async function (id) {

    const results = await UserProfile.findById(id); 
    return results;
}

UserProfileService.getUserByEmail = async function (email) {

    const results = await UserProfile.findOne({signupEmail: email.toLowerCase()}); 
    return results;
}

module.exports = UserProfileService;

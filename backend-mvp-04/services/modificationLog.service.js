/* eslint-disable func-names */
const { ModificationLog } = require('../models/modificationLog.model');

const ModificationLogService = {};

ModificationLogService.saveLog = async function (authorEmail, objectId, objectType, theObject) {
    
    await ModificationLog.create({date: new Date(), authorEmail,
        objectId, objectType, newState: theObject});

}

ModificationLogService.getLogs = async function (objectId, objectType) {

    const results = await ModificationLog.find({objectId, objectType}); 
    return results;
}

module.exports = ModificationLogService;

/* eslint-disable func-names */
const { TimeZone } = require('../models/dictionaries/timeZone.model');

const TimeZoneService = {};

TimeZoneService.getTimeZones = async function () {
    
    const result = await TimeZone.findOne();
    return result.timeZones;

}

module.exports.TimeZoneService = TimeZoneService;

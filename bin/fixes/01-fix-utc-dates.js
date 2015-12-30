/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var _ = require('lodash');
var moment = require('moment-timezone');
var common = require('../../lib/');
var logger = common.utils.logger;
var userManager = common.user.manager;
var printManager = common.print.manager;

//init db
common.db.connect();

var options = {
    criteria: {
        signupComplete: true
    }
};

//backfill users
userManager.findAll(options).
then(function(users) {
    _.forEach(users, function(user) {
        if (!hasUtcDate(user.signupCompletedOn)) {
            var normalizedDate = normalizeDate(user.signupCompletedOn);
            user.signupCompletedOn = normalizedDate;

            console.log(user.instagram.username, normalizedDate.format());
            user.save();
        }
    });
});

// image sets
printManager.findAll().
then(function(imageSets) {
    _.forEach(imageSets, function(imageSet) {
        if (!hasUtcDate(imageSet.startDate)) {
            imageSet.startDate = normalizeDate(imageSet.startDate);
            logger.info(imageSet.user.instagram.username);
            logger.info(imageSet.startDate);
        }

        if (!hasUtcDate(imageSet.endDate)) {
            imageSet.endDate = normalizeDate(imageSet.endDate);
        }

        imageSet.save();
    });
});

/**
 * @param date
 * @returns {*}
 */
function normalizeDate(date) {
    return moment(date).utc().hour(14).minute(0).second(0);
}

/**
 * @param date
 * @returns {boolean}
 */
function hasUtcDate(date) {
    var momentDate = moment(date).utc();
    return momentDate.hours() === 14 && momentDate.minutes() === 0 && momentDate.second() === 0;
}
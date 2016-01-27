#!/usr/bin/env node

process.env.TZ = 'UTC';

var _ = require('lodash');
var q = require('q');
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
    var promises = [];
    _.forEach(users, function(user) {
        if (!hasUtcDate(user.signupCompletedOn)) {
            var promise = q.defer();
            promises.push(promise.promise);
            var normalizedDate = normalizeDate(user.signupCompletedOn);
            user.signupCompletedOn = normalizedDate;

            logger.info('User sign up on ' + user.instagram.username + ' : ' + normalizedDate.format());
            user.save(function() {
                promise.resolve();
            });
        }
    });

    return q.all(promises);
}).
then(function() {
    logger.info('Get all image sets');
    return printManager.findAll();
}).
then(function(imageSets) {
    var promises = [];
    logger.info('Found ' + imageSets.length + ' image sets');
    _.forEach(imageSets, function(imageSet) {
        var updated = false;
        var promise;

        if (!hasUtcDate(imageSet.startDate)) {
            var startDate = normalizeDate(imageSet.startDate);
            imageSet.startDate = startDate;
            logger.info('User ' + imageSet.user.instagram.username);
            logger.info('Image set period ' + imageSet.period);
            logger.info('Start date: ' + startDate.format());
            updated = true;
        }

        if (!hasUtcDate(imageSet.endDate)) {
            var endDate = normalizeDate(imageSet.endDate);
            imageSet.endDate = endDate;
            logger.info('End date: ' + endDate.format());
            updated = true;
        }

        if (updated) {
            promise = q.defer();
            imageSet.save(function() {
                promise.resolve();
            });
            promises.push(promise.promise);
        }
    });

    return q.all(promises);
}).
then(function() {
    logger.info('Updates complete');
    process.exit(0);
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
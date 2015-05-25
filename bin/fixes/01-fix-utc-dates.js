/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var q = require('q');
var _ = require('lodash');
var moment = require('moment-timezone');
var common = require('../../lib/');
var logger = common.utils.logger;
var userManager = common.user.manager;
var printManager = common.print.manager;

//init db
common.db.connect();

//var options = {criteria: {'instagram.username': 'kirstyristevski'}};
var options = {
    criteria: {
        active: true
    }
};

//backfill
userManager.findAll(options).then(function(users) {
    var deferreds = [];
    var i = 0;
    var total = users.length;

    _.forEach(users, function(user) {
        var signupDate = moment(user.signupCompletedOn);

        if (hasUtcDate(signupDate)) {
            logger.info('------------------------ FOUND USER ' + user.getUsername() + ' ----- WITH ' +
                signupDate.format());

            var deferred = q.defer();
            deferreds.push(deferred.promise);

            var normalizedDate = normalizeDate(signupDate);
            user.createdOn = normalizedDate;
            user.signupCompletedOn = normalizedDate;
            logger.info('------------------------ HERE USER ' + user.getUsername() + ' ----- WITH ' +
                user.signupCompletedOn);

            user.save();
            printManager.findAllByUser(user).
                then(function(imageSets) {
                    logger.info('Found ' + imageSets.length + ' sets for ' + user.getUsername());

                    var printDeferreds = [];

                    _.forEach(imageSets, function(imageSet) {
                        var periodStartDate = user.getPeriodStartDate(imageSet.period);
                        var periodEndDate = user.getPeriodEndDate(imageSet.period);

                        logger.info('------------ SAVE IMAGE SET START ' + user.getUsername() + ' ----- ' +
                            periodStartDate + ' TO ' + imageSet.startDate);
                        logger.info('------------ SAVE IMAGE SET END ' + user.getUsername() + ' ----- ' +
                            periodEndDate + ' TO ' + imageSet.endDate);

                        imageSet.startDate = periodStartDate;
                        imageSet.endDate = periodEndDate;

                        imageSet.save();
                    });

                    return q.all(printDeferreds);
                }).
                fail(function(err) {
                    logger.error(err);
                }).
                done();
        }

        i++;
    });

    return q.all(deferreds).then(function() {
        logger.info('WE ARE DONE!');
    });
});

/**
 * @param date
 * @returns {*}
 */
function normalizeDate(date) {
    //return moment(date).hour(14).subtract(1, 'days').tz('Australia/Melbourne');
    return moment(date).tz('Australia/Melbourne').startOf('day').format();
}

/**
 * @param date
 * @returns {boolean}
 */
function hasUtcDate(date) {
    return date.hours() === 0 && date.minutes() === 0;
}
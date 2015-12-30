/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var _ = require('lodash');
var common = require('../../lib/');
var logger = common.utils.logger;
var userManager = common.user.manager;
var printManager = common.print.manager;

//init db
common.db.connect();

//backfill users
userManager.findAll().
then(function(users) {
    _.forEach(users, function(user) {
        logger.info(user.instagram.username);
        printManager.findAllByUser(user).
        then(function(imageSets) {
            _.forEach(imageSets, function(imageSet) {
                imageSet.user.active = user.active;
                imageSet.user.signupComplete = user.signupComplete;
                imageSet.createdOn = imageSet.startDate;
                imageSet.updatedOn = imageSet.isPrinted ? imageSet.endDate : imageSet.startDate;
                imageSet.save();
            });
        });
    });
});
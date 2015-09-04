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

var options = {
    criteria: {
        signupComplete: false,
        signupCompletedOn: {
            $exists: false
        }
    }
};

//backfill users
userManager.findAll(options).
    then(function(users) {
        _.forEach(users, function(user) {
            printManager.findAllByUser(user).
                then(function(imageSets) {
                    _.forEach(imageSets, function(imageSet) {
                        logger.info(imageSet.user.instagram.username);
                        imageSet.remove();
                    });
                });
        });
    });
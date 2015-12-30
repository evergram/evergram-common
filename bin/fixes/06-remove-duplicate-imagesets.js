/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var _ = require('lodash');
var moment = require('moment');
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
        printManager.findAllByUser(user).
        then(function(imageSets) {
            var imgSetDuplicates = {};

            _.forEach(imageSets, function(imageSet) {
                imgSetDuplicates[getKey(imageSet)] = imgSetDuplicates[getKey(imageSet)] || [];
                imgSetDuplicates[getKey(imageSet)].push(imageSet);
            });

            removeDuplicates(imgSetDuplicates);
        });
    });
});

function getKey(imageSet) {
    return moment(imageSet.startDate).format('YYYY-MM-DD') + '-' + moment(imageSet.endDate).format('YYYY-MM-DD');
}

function removeDuplicates(imgSetDuplicates) {
    _.forEach(imgSetDuplicates, function(imageSets) {
        if (imageSets.length > 1) {
            var dedupedImageSets = imageSets.splice(0, 1);
            _.forEach(dedupedImageSets, function(imageSet) {
                logger.info('Removing image set for ' + imageSet.user.instagram.username + ' with id ' + imageSet._id);
                imageSet.remove();
            });
        }
    });
}
/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var _ = require('lodash');
var common = require('../../lib/');
var logger = common.utils.logger;
var printManager = common.print.manager;

//init db
common.db.connect();

//backfill users
printManager.findAll({
    criteria: {
        isPrinted: false,
        endDate: {
            $lte: new Date()
        }
    }
}).
then(function(imageSets) {
    _.forEach(imageSets, function(imageSet) {
        logger.info('Removed the image set: ' + imageSet.user.instagram.username + ' : ' + imageSet._id);
        imageSet.remove();
    });
});
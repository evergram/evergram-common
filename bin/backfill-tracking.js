/**
 * Module dependencies
 */


var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var common = require('../lib/');
var user = common.models.User;
var logger = common.utils.logger;
var userManager = common.user.manager;
var trackingManager = common.tracking.manager;
var printManager = common.print.manager;

//init db
common.db.connect();

var id = '5522342ea6b18aa5083472f9';
//var options = {criteria: {_id: id}};
var options = {};

//backfill
userManager.findAll(options).then(function (users) {
    var deferreds = [];

    _.forEach(users, function (user) {
        var deferred = q.defer();
        deferreds.push(deferred.promise);

        //create user
        trackingManager.createUser(user).then(function () {
            return trackingManager.importSignup(user);
        }).then(function () {
            printManager.findAllByUser(user).then(function (imageSets) {
                var printDeferreds = [];

                _.forEach(imageSets, function (imageSet) {
                    //track tagged images
                    var imagesCombinedSet = trackImageSets(imageSet);
                    _.forEach(imagesCombinedSet, function (images, key) {
                        var printDeferred = q.defer();
                        printDeferreds.push(printDeferred.promise);

                        q.when(trackTaggedImages(user, imageSet, images, key), function () {
                            printDeferred.resolve();
                            logger.info('Done tagged images for ' + user.getUsername() + ' on ' + key);
                        }).fail(function (err) {
                            logger.error('Error ' + user.getUsername() + ' on ' + key, err);
                            printDeferred.resolve();
                        });
                    });

                    if (imageSet.isPrinted) {
                        //track print
                        var printedDeferred = q.defer();
                        printDeferreds.push(printedDeferred.promise);

                        q.when(trackPrintedImageSet(user, imageSet, key), function () {
                            printedDeferred.resolve();
                            logger.info('Done printed for ' + user.getUsername() + ' on ' + key);
                        }).fail(function (err) {
                            logger.error('Error ' + user.getUsername() + ' on ' + key, err);
                            printedDeferred.resolve();
                        });
                    }
                });

                return q.all(printDeferreds);
            }).then(function () {
                deferred.resolve();
            });
        });
    });

    return q.all(deferreds);
});

function trackImageSets(imageSet) {
    var combinedImages = {};

    _.forEach(imageSet.images, function (images) {
        _.forEach(images, function (image) {
            var key = moment(image.date).hour(0).minute(0).second(0);

            if (!combinedImages[key]) {
                combinedImages[key] = new Array;
            }

            combinedImages[key].push(image);
        });
    });

    return combinedImages;
}

function trackTaggedImages(user, imageSet, images, date) {
    var event = 'Tagged Images';

    var total = 0;
    var owned = 0;
    var other = 0;

    _.forEach(images, function (image) {
        total++;
        if (image.isOwner || image.instagram.username == user.getUsername()) {
            owned++;
        } else {
            other++;
        }
    });

    if (total > 0) {
        logger.info('Tracking ' + event + ' for ' + user.getUsername());

        return trackingManager.incrementMultiple(user, {
            'Total Images Tagged': total,
            'Total Own Images Tagged': owned,
            'Total Other Images Tagged': other
        }).then(function () {
            return trackingManager.importEvent(user, event, date, {
                'Service': 'Instagram',
                'Plan': user.billing.option,
                'Instagram Username': user.instagram.username,
                'Period': user.getPeriodFromStartDate(imageSet.startDate),
                'Country': imageSet.user.address.country,
                'State': imageSet.user.address.state,
                'City': imageSet.user.address.suburb,
                'Image Set Start Date': imageSet.startDate,
                'Image Set End Date': imageSet.endDate,
                'Total Images Tagged': total,
                'Total Own Images Tagged': owned,
                'Total Other Images Tagged': other
            });
        });
    } else {
        return true;
    }
}

function trackPrintedImageSet(user, imageSet, date) {
    var event = 'Finalized Image Set';

    var total = 0;
    var owned = 0;
    var other = 0;

    _.forEach(imageSet.images, function (images) {
        _.forEach(images, function (image) {
            total++;
            if (image.isOwner || image.instagram.username == user.getUsername()) {
                owned++;
            } else {
                other++;
            }
        });
    });

    logger.info('Tracking ' + event + ' for ' + user.getUsername());

    return trackingManager.importEvent(user, event, date, {
        'Plan': user.billing.option,
        'Instagram Username': user.instagram.username,
        'Period': user.getPeriodFromStartDate(imageSet.startDate),
        'Country': imageSet.user.address.country,
        'State': imageSet.user.address.state,
        'City': imageSet.user.address.suburb,
        'Image Set Start Date': imageSet.startDate,
        'Image Set End Date': imageSet.endDate,
        'Total Images Tagged': total,
        'Total Own Images Tagged': owned,
        'Total Other Images Tagged': other
    });
}
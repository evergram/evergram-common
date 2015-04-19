/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

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

var options = {criteria: {'instagram.username': 'jacq1313'}};
//var options = {};

//backfill
userManager.findAll(options).then(function (users) {
    var deferreds = [];
    var i = 0;
    _.forEach(users, function (user) {
        logger.log(user.getUsername(), i);
        var deferred = q.defer();
        deferreds.push(deferred.promise);

        //create user
        createUser(user).then(function () {
            logger.info('Created user in Segment');

            printManager.findAllByUser(user).
            then(function (imageSets) {
                logger.info('Found ' + imageSets.length + ' sets for ' + user.getUsername());

                var printDeferreds = [];

                _.forEach(imageSets, function (imageSet) {
                    //track tagged images
                    var printDeferred = q.defer();
                    printDeferreds.push(printDeferred.promise);

                    logger.info('Tracking ' + imageSet.images.instagram.length + ' images for set');

                    trackTaggedImages(user, imageSet).
                    then(function () {
                        printDeferred.resolve();
                        logger.info('Done tagged images for ' + user.getUsername() + ' on ' + key);
                    }).
                    fail(function (err) {
                        logger.error('Error ' + user.getUsername() + ' on ' + key, err);
                        printDeferred.resolve();
                    });

                    if (imageSet.isPrinted) {
                        //track print
                        var printedDeferred = q.defer();
                        printDeferreds.push(printedDeferred.promise);

                        trackPrintedImageSet(user, imageSet)
                    }
                });

                return q.all(printDeferreds);
            }).
            fail(function (err) {
                logger.error(err);
            });
        });
        i++;
    });

    return q.all(deferreds);
});

function createUser(user) {
    return trackingManager.createUser(user).then(function () {
        logger.info('Registering Signed Up for ' + user.getUsername());
        return trackingManager.trackEvent(user, 'Signed Up', {
            plan: user.billing.option
        }, moment(user.createdOn).toDate());
    });
}

function trackTaggedImages(user, imageSet) {
    var deferreds = [];
    var event = 'Tagged a photo';

    logger.info('Tracking ' + event + ' for ' + user.getUsername());

    _.forEach(imageSet.images.instagram, function (image) {
        var deferred = trackingManager.trackEvent(user, event, {
            service: 'instagram',
            owner: image.owner,
            type: image.isOwner ? 'own' : 'friends',
            isHistorical: moment(image.createdOn).isBefore(user.createdOn),
            link: image.metadata.link,
            image: image.raw,
            period: user.getPeriodFromStartDate(imageSet.startDate),
            createdOn: moment(image.createdOn).toDate(),
            taggedOn: moment(image.taggedOn).toDate()
        }, image.taggedOn);

        deferreds.push(deferred);
    });

    return q.all(deferreds);
}

function trackPrintedImageSet(user, imageSet) {
    var event = 'Shipped photos';

    var total = 0;
    var owned = 0;
    var other = 0;

    _.forEach(imageSet.images, function (images) {
        _.forEach(images, function (image) {
            total++;
            if (image.isOwner) {
                owned++;
            } else {
                other++;
            }
        });
    });

    logger.info('Tracking ' + event + ' for ' + user.getUsername());

    return trackingManager.trackEvent(user, event, {
        imageSetId: imageSet._id.toString(),
        photoCount: total,
        ownPhotoCount: owned,
        friendsPhotoCount: other,
        period: imageSet.period,
        startDate: moment(imageSet.startDate).toDate(),
        endDate: moment(imageSet.endDate).toDate(),
        shippedOn: moment(imageSet.endDate).toDate()
    }, moment(imageSet.endDate).toDate());
}
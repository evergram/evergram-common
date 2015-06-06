/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var common = require('../lib/');
var logger = common.utils.logger;
var userManager = common.user.manager;
var trackingManager = common.tracking.manager;
var printManager = common.print.manager;

//init db
common.db.connect();

var options = {criteria: {'instagram.username': 'andyrsalon'}};
//var options = {
//    criteria: {
//        active: true
//    }
//};
//var options = {
//    criteria: {
//        _id: {
//            $in: [
//                '554c36c5a587677837e2a0d0',
//                '555115691bf668e7a97f5cc1',
//                '554c95d6a587677837e2a0d3',
//                '555115681bf668e7a97f5cbe',
//                '5530f4dc08df2c270de6be52',
//                '554ccf95a587677837e2a0d4',
//                '555e6a1da587677837e2a0d9',
//                '554c5b91a587677837e2a0d1',
//                '55504b5aa587677837e2a0d5',
//                '555115681bf668e7a97f5cbd',
//                '5553257c1bf668e7a97f5cc2',
//                '5553257d1bf668e7a97f5cc3',
//                '555115681bf668e7a97f5cc0',
//                '555115681bf668e7a97f5cbf'
//            ]
//        }
//    }
//};

//backfill
userManager.findAll(options).then(function(users) {
    var deferreds = [];
    var i = 0;
    var total = users.length;

    _.forEach(users, function(user) {
        logger.info('------------------------ STARTING USER ' + i + ' of ' + total);
        var deferred = q.defer();
        deferreds.push(deferred.promise);

        //create user
        createUser(user).
            then(function() {
                logger.info('Created user in Segment');
                printManager.findAllByUser(user).
                    then(function(imageSets) {
                        logger.info('Found ' + imageSets.length + ' sets for ' + user.getUsername());

                        var printDeferreds = [];

                        _.forEach(imageSets, function(imageSet) {
                            //track tagged images
                            var printDeferred = q.defer();
                            printDeferreds.push(printDeferred.promise);

                            logger.info('Tracking ' + imageSet.images.instagram.length + ' images for set');

                            trackTaggedImages(user, imageSet).
                                then(function() {
                                    logger.info('Done tagged images for ' + user.getUsername());
                                    printDeferred.resolve();
                                }).
                                fail(function(err) {
                                    logger.error('Error ' + user.getUsername(), err);
                                    printDeferred.resolve();
                                });

                            if (imageSet.isPrinted && imageSet.images.instagram.length > 0) {
                                //track print
                                var printedDeferred = q.defer();
                                printDeferreds.push(printedDeferred.promise);

                                trackPrintedImageSet(user, imageSet);
                            }
                        });

                        return q.all(printDeferreds);
                    }).
                    fail(function(err) {
                        logger.error(err);
                    }).
                    done();
            }).
            done(function() {
                logger.info('------------------------ COMPLETED USER ' + i + ' of ' + total);
                deferred.resolve();
            });

        i++;
    });

    return q.all(deferreds).then(function() {
        logger.info('WE ARE DONE!');
    });
});

function createUser(user) {
    return trackingManager.createUser(user).
        then(function() {
            if (!_.isEmpty(user.instagram.username)) {
                logger.info('Connecting a service for ' + user.getUsername());

                return trackingManager.trackEvent(user, 'Connected a service', {
                    service: 'Instagram',
                    instagramUsername: user.instagram.username
                }, moment(user.createdOn).toDate());
            } else {
                return q.fcall(function() {
                    return true;
                });
            }
        }).
        then(function() {
            if (user.signupComplete === true) {
                logger.info('Registering Signed Up for ' + user.getUsername());

                return trackingManager.trackEvent(user, 'Signed up', {
                    plan: user.billing.option
                }, moment(user.signupCompletedOn).toDate());
            } else {
                return q.fcall(function() {
                    return true;
                });
            }
        });
}

function trackTaggedImages(user, imageSet) {
    var deferreds = [];
    var event = 'Tagged a photo';

    logger.info('Tracking ' + event + ' for ' + user.getUsername());

    _.forEach(imageSet.images.instagram, function(image) {
        var deferred = trackingManager.trackEvent(user, event, {
            service: 'instagram',
            owner: image.owner,
            type: image.isOwner ? 'own' : 'friends',
            isHistorical: moment(image.createdOn).isBefore(user.signupCompletedOn),
            link: image.metadata.link,
            image: image.src.raw,
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

    _.forEach(imageSet.images, function(images) {
        _.forEach(images, function(image) {
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
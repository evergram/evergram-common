/**
 * @author v2 Richard O'Brien <richard@printwithpixy.com>
 * author v1 Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var config = require('../../config').instagram;
var logger = require('../../utils').logger;
var trackingManager = require('../../tracking/manager');
var instagramImageMapper = require('../../mapper').instagramImage;
var Api = require('./api');

/**
 * A manager which provides a simple api to interact with Instagram.
 *
 * @param user
 * @constructor
 */
function InstagramManager() {

}

/**
 * Finds an instagram user from the passed id.
 *
 * @param userId
 * @returns {promise|*|q.promise}
 */
InstagramManager.prototype.findUser = function(userId) {
    var api = new Api();

    return q.ninvoke(api, 'user', userId);
};

/**
 * Finds all printable posts for a user.
 *
 * @param user
 * @param dateFrom
 * @param dateTo
 * @returns {promise|*|q.promise}
 */
InstagramManager.prototype.findPrintableImagesByUser = function(user, dateFrom, dateTo) {

    var deferred = q.defer();

    this.findImagesByUser(user).
        then(function(images) {

            var deferreds = [];
            var printableImages = [];
            
            _.forEach(images, function(image) {

                var imageDeferred = q.defer();

                deferreds.push(imageDeferred.promise);

                hasPrintTag(user, image, dateFrom, dateTo).
                    then(function(hasTag) {
                        if (hasTag) {
                            printableImages.push(image);
                        }
                        imageDeferred.resolve();
                    }).fail(function(err){
                        imageDeferred.reject(err);
                    });
                
            });

            q.all(deferreds).then(function() {
                deferred.resolve(printableImages);
            });
        });

    return deferred.promise;
};

/**
 * Finds all printable posts for a user.
 *
 * @param user
 * @returns {promise|*|q.promise}
 */
InstagramManager.prototype.findImagesByUser = function(user) {
    var deferred = q.defer();
    var imageSets = [];

    if (!user || !user.instagram || !user.instagram.id) {
        deferred.reject('No instagram id for user' + user._id);
    } else {
        try {

            var api = new Api(user);

            getUserMediaRecent(api, user).
                then(function(images) {
                    imageSets.push(images);
                    deferred.resolve(combineImageSets(imageSets));
                }).
                fail(function(err) {
                    logger.error('Cannot fetch recent media for ' + user.getUsername(), err);
                    deferred.reject(err);
                });

        } catch (err) {
            deferred.reject(err);
        }
    }

    return deferred.promise;
};

/**
 *  DEPRECATED: No longer accessible with new Instagram API
 *
 * @param api
 * @param userId
 * @param options
 * @returns {promise|*|q.promise}
 */
function getUserMediaLiked(api, user, options) {
    var deferred = q.defer();
    var images = [];
    var currentPage = 0;

    if (!options) {
        options = {};
    }

    var callback = function(err, results, pagination) {
        if (!!err) {
            trackError(user, err);
            deferred.reject(err);
        }

        _.forEach(results, function(result) {
            var image = instagramImageMapper.toModel(result, user);
            images.push(image);
        });

        //paging
        if (!!pagination && !!pagination.next) {
            currentPage++;
            pagination.next(callback);
        } else {
            deferred.resolve(images);
        }
    };

    //make the first api call
    api.user_self_liked(options, callback);

    return deferred.promise;
}

/**
 *
 * @param api
 * @param userId
 * @param options
 * @returns {promise|*|q.promise}
 */
function getUserMediaRecent(api, user, options) {
    var deferred = q.defer();
    var images = [];
    var currentPage = 0;

    if (!options) {
        options = {};
    }

    var callback = function(err, results, pagination) {
        if (!!err) {
            trackError(user, err);
            deferred.reject(err);
        }

        _.forEach(results, function(result) {
            var image = instagramImageMapper.toModel(result, user);
            images.push(image);
        });

        //paging
        if (!!pagination && !!pagination.next) {
            currentPage++;
            pagination.next(callback);
        } else {
            deferred.resolve(images);
        }
    };

    //make the first api call
    api.user_media_recent(user.instagram.id, options, callback);

    return deferred.promise;
}

/**
 * A test to see if a post contains the tags required to be printed.
 *
 * @param user
 * @param image
 * @param dateFrom
 * @param dateTo
 * @returns {boolean}
 */
function hasPrintTag(user, image, dateFrom, dateTo) {

    var deferred = q.defer();

    /**
     * If the image is by this user, we check the caption
     */
    if (hasPrintTagInCaption(user, image, dateFrom, dateTo)) {
        return q.fcall(function() {
                    return true;
                });
    }
    /**
     * We check the comments for the tag by the current user
     */
    else {

        try {

            var api = new Api(user);

            hasPrintTagInComments(api,user, image, dateFrom, dateTo).
                then(function(hasTag) {
                    deferred.resolve(hasTag);
                }).
                fail(function(err) {
                    logger.error('Cannot fetch comments for ' + user.getUsername() + " image [ID: " + image._id + "]", err);
                    deferred.reject(err);
                });

        } catch (err) {
            logger.error('Cannot fetch comments for ' + user.getUsername() + " image [ID: " + image._id + "]", err);
            deferred.reject(err);
        }
    }

    return deferred.promise;
}

/**
 * A test to see if a post contains the tags within the caption required to be printed.
 *
 * It also sets the image taggedOn based on the caption created_time.
 *
 * @param user
 * @param image
 * @param dateFrom
 * @param dateTo
 * @returns {boolean}
 */
function hasPrintTagInCaption(user, image, dateFrom, dateTo) {
    var userId = user.instagram.id;

    if (!!image.metadata.caption && !!image.metadata.user.id) {
        var imageUserId = image.metadata.user.id;
        var caption = image.metadata.caption.text;

        if (imageUserId === userId && containsTag(caption) && !hasIgnoreTag(caption)) {
            var taggedOn = moment.unix(image.metadata.created_time);
            var tag = getPrintTag(caption);

            if (!!dateFrom && !!dateTo) {
                if (taggedOn.isAfter(dateFrom) &&
                    taggedOn.isBefore(dateTo)) {
                    image.taggedOn = taggedOn;
                    image.tag = tag;
                    return true;
                }
            } else if (!!dateFrom && !dateTo) {
                if (taggedOn.isAfter(dateFrom)) {
                    image.taggedOn = taggedOn;
                    image.tag = tag;
                    return true;
                }
            } else if (!dateFrom && !!dateTo) {
                if (taggedOn.isBefore(dateTo)) {
                    image.taggedOn = taggedOn;
                    image.tag = tag;
                    return true;
                }
            } else {
                image.tag = tag;
                return true;
            }
        }
    }

    return false;
}

/**
 * A test to see if a post contains the tags within the comments required to be printed.
 *
 * It also sets the image taggedOn based on the comment created_time.
 *
 * @param user
 * @param image
 * @param dateFrom
 * @param dateTo
 * @returns {promise|*} //{boolean}
 */
function hasPrintTagInComments(api, user, image, dateFrom, dateTo) {
    var hasTag = false;
    var userId = user.instagram.id;
    var deferred = q.defer();
    var currentPage = 0;

    var options = {};

    var callback = function(err, results, pagination) {
        if (!!err) {
            trackError(user, err);
            deferred.reject(err);
        }

        _.forEach(results, function(comment) {

            /**
             * Check that the comment was made by the current user and that it also contains the tag
             */
            if (comment.from.id === userId && containsTag(comment.text) && !hasIgnoreTag(comment.text)) {
                var taggedOn = moment.unix(comment.created_time);
                var tag = getPrintTag(comment.text);

                /**
                 * If we pass in a date, we check to ensure the comment was made after the date
                 */
                if (!!dateFrom && !!dateTo) {
                    if (taggedOn.isAfter(dateFrom) &&
                        taggedOn.isBefore(dateTo)) {
                        image.taggedOn = taggedOn;
                        image.tag = tag;
                        hasTag = true;
                        return deferred.resolve(hasTag);
                    }
                } else if (!!dateFrom && !dateTo) {
                    if (taggedOn.isAfter(dateFrom)) {
                        image.taggedOn = taggedOn;
                        image.tag = tag;
                        hasTag = true;
                        return deferred.resolve(hasTag);
                    }
                } else if (!dateFrom && !!dateTo) {
                    if (taggedOn.isBefore(dateTo)) {
                        image.taggedOn = taggedOn;
                        image.tag = tag;
                        hasTag = true;
                        return deferred.resolve(hasTag);
                    }
                } else {
                    image.tag = tag;
                    hasTag = true;
                    return deferred.resolve(hasTag);
                }
            }
        });

        //paging
        if (!!pagination && !!pagination.next) {
            currentPage++;
            pagination.next(callback);
        } else {
            return deferred.resolve(hasTag);
        }
    };

    if (image.metadata.comments.count > 0) {
        // make the api call if media has comments
        api.comments(image.metadata.id, callback);
    } else {
        return q.fcall(function() {
                    return false;
                });
    }

    return deferred.promise;
}

/**
 * Checks if the text contains an ignore tag
 *
 * @param text
 * @returns {boolean}
 */
function hasIgnoreTag(text) {
    return getIgnoreTagRegex().test(text.toLowerCase());
}

/**
 * The ignore regex.
 *
 * @returns {RegExp}
 */
function getIgnoreTagRegex() {
    return new RegExp(config.ignoreTag, 'g');
}

/**
 * Tests if the string contains the print tag.
 *
 * @param text
 * @returns {boolean}
 */
function containsTag(text) {
    return getPrintTagRegex().test(text.toLowerCase());
}

/**
 * Gets the first tag recognized in the passed string.
 *
 * @param text
 * @returns {String}
 */
function getPrintTag(text) {
    return text.toLowerCase().match(getPrintTagRegex())[0];
}

/**
 * Gets a regular expression from the passed config.
 *
 * @returns {RegExp}
 */
function getPrintTagRegex() {
    return new RegExp(config.printTag, 'g');
}

/**
 * @param imageSets
 * @returns {T|*}
 */
function combineImageSets(imageSets) {
    return _.uniq(_.flatten(imageSets), '_id');
}

/**
 * Fires a tracking event via the TrackingManager in evergram-common containing the error type, code, and message. Example errors include:
 *    - "OAuthAccessTokenException" (code: 400)
 *    - "OAuthRateLimitException" (code: 429)
 *    - "SyntaxError: Unexpected token O" (code: 500) ... note error returns in diff format. Check logs.
 * 
 * @param user
 * @param err
 * @return {promise|*}
 */
function trackError(user, err) {
    logger.info('Tracking Instagram API error for ' + user.getUsername());


    return trackingManager.trackEvent(user, 'Instagram API Error', {
        service: 'Instagram',
        instagramUsername: user.instagram.username,
        error_type: err.error_type,
        error_code: err.code,
        message: err.error_message,
        _raw: err
    }, moment().toDate());
}

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new InstagramManager();

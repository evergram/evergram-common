/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var config = require('../../config').instagram;
var logger = require('../../utils').logger;
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
InstagramManager.prototype.findUser = function (userId) {
    var deferred = q.defer();
    var api = new Api();

    api.user(userId, function (err, user, remaining, limit) {
        if (!!err) {
            deferred.reject(err);
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise;
};

/**
 * Finds all printable posts for a user.
 *
 * @param user
 * @returns {promise|*|q.promise}
 */
InstagramManager.prototype.findPrintableImagesByUser = function (user, dateFrom) {
    var deferred = q.defer();
    try {
        this.findImagesByUser(user).then(function (images) {
            var printableImages = [];
            _.forEach(images, function (image) {
                if (hasPrintTag(user, image, dateFrom)) {
                    printableImages.push(image);
                }
            });
            deferred.resolve(printableImages);
        }, function (err) {
            deferred.reject(err);
        });
    } catch (err) {
        logger.error(err);
        deferred.reject(err);
    }

    return deferred.promise;
};

/**
 * Finds all printable posts for a user.
 *
 * @param user
 * @returns {promise|*|q.promise}
 */
InstagramManager.prototype.findImagesByUser = function (user) {
    var deferred = q.defer();
    var imageSets = [];

    if (!user || !user.instagram || !user.instagram.id) {
        var err = 'No instagram id for user' + user._id;
        logger.warning(err);
        deferred.reject(err);
    } else {
        try {
            var deferreds = [];
            var likedDeferred = q.defer();
            var recentDeferred = q.defer();
            deferreds.push(likedDeferred.promise);
            deferreds.push(recentDeferred.promise);

            var api = new Api(user);

            getUserMediaLiked(api).then(function (images) {
                imageSets.push(images);
                likedDeferred.resolve();
            });

            getUserMediaRecent(api, user.instagram.id).then(function (images) {
                imageSets.push(images);
                recentDeferred.resolve();
            });

            q.all(deferreds).then(function () {
                deferred.resolve(combineImageSets(imageSets));
            });
        } catch (err) {
            logger.warning(err);
            deferred.reject(err);
        }
    }

    return deferred.promise;
};

/**
 *
 * @param api
 * @param userId
 * @param options
 * @returns {promise|*|q.promise}
 */
function getUserMediaLiked(api, options) {
    var deferred = q.defer();
    var images = [];
    var currentPage = 0;

    if (!options) {
        options = {};
    }

    var callback = function (err, results, pagination, remaining, limit) {
        _.forEach(results, function (result) {
            var image = instagramImageMapper.toModel(result);
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
};

/**
 *
 * @param api
 * @param userId
 * @param options
 * @returns {promise|*|q.promise}
 */
function getUserMediaRecent(api, userId, options) {
    var deferred = q.defer();
    var images = [];
    var currentPage = 0;

    if (!options) {
        options = {};
    }

    var callback = function (err, results, pagination, remaining, limit) {
        _.forEach(results, function (result) {
            var image = instagramImageMapper.toModel(result);
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
    api.user_media_recent(userId, options, callback);

    return deferred.promise;
};

/**
 * A test to see if a post contains the tags to inidicate it is printable.
 *
 * @param post
 * @returns {boolean}
 */
function hasPrintTag(user, image, dateFrom) {
    /**
     * If the image is by this user, we check the caption
     */
    if (hasPrintTagInCaption(user, image, dateFrom)) {
        return true;
    }
    /**
     * We check the comments for the tag by the current user
     */
    else if (hasPrintTagInComments(user, image, dateFrom)) {
        return true;
    }

    return false;
}

/**
 * A test to see if a post contains the tags to inidicate it is printable.
 *
 * @param post
 * @returns {boolean}
 */
function hasPrintTagInCaption(user, image, dateFrom) {
    var userId = user.instagram.id;

    if (!!image.metadata.caption && !!image.metadata.user.id) {
        var imageUserId = image.metadata.user.id;
        var caption = image.metadata.caption.text;

        if (imageUserId == userId && caption.toLowerCase().indexOf(config.printTag) > -1) {
            if (!!dateFrom) {
                if (moment.unix(image.metadata.created_time).isAfter(dateFrom)) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }
    return false;
}

/**
 * Tests whether any comments contain the print tag
 *
 * @param comments
 * @returns {boolean}
 */
function hasPrintTagInComments(user, image, dateFrom) {
    var hasTag = false;
    var userId = user.instagram.id;

    if (!!image.metadata.comments) {
        var comments = image.metadata.comments.data;

        _.forEach(comments, function (comment) {
            /**
             * Check that the comment was made by the current user and that it also contains the tag
             */
            if (comment.from.id == userId && comment.text.toLowerCase().indexOf(config.printTag) > -1) {
                /**
                 * If we pass in a date, we check to ensure the comment was made after the date
                 */
                if (!!dateFrom) {
                    if (moment.unix(comment.created_time).isAfter(dateFrom)) {
                        hasTag = true;
                        return;
                    }
                } else {
                    hasTag = true;
                    return;
                }
            }
        });

        return hasTag;
    }

    return false;
}

/**
 *
 * @param imageSets
 * @returns {T|*}
 */
function combineImageSets(imageSets) {
    return _.uniq(_.flatten(imageSets), '_id');
}

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new InstagramManager;

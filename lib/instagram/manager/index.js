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
    return this.findImagesByUser(user).
    then(function(images) {
        var printableImages = [];

        _.forEach(images, function(image) {
            if (hasPrintTag(user, image, dateFrom, dateTo)) {
                printableImages.push(image);
            }
        });

        return printableImages;
    });
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
            var deferreds = [];
            var likedDeferred = q.defer();
            var recentDeferred = q.defer();
            deferreds.push(likedDeferred.promise);
            deferreds.push(recentDeferred.promise);

            var api = new Api(user);

            getUserMediaLiked(api, user).
            then(function(images) {
                imageSets.push(images);
                likedDeferred.resolve();
            }).
            fail(function(err) {
                logger.error('Cannot fetch liked media for ' + user.getUsername(), err);
                deferred.reject(err);
            });

            getUserMediaRecent(api, user).
            then(function(images) {
                imageSets.push(images);
                recentDeferred.resolve();
            }).
            fail(function(err) {
                logger.error('Cannot fetch recent media for ' + user.getUsername(), err);
                deferred.reject(err);
            });

            q.all(deferreds).then(function() {
                deferred.resolve(combineImageSets(imageSets));
            });
        } catch (err) {
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
function getUserMediaLiked(api, user, options) {
    var deferred = q.defer();
    var images = [];
    var currentPage = 0;

    if (!options) {
        options = {};
    }

    var callback = function(err, results, pagination) {
        if (!!err) {
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

    /**
     * Checks if the image is ignored
     */
    if (hasIgnoreTag(user, image)) {
        return false;
    }
    /**
     * If the image is by this user, we check the caption
     */
    else if (hasPrintTagInCaption(user, image, dateFrom, dateTo)) {
        return true;
    }
    /**
     * We check the comments for the tag by the current user
     */
    else if (hasPrintTagInComments(user, image, dateFrom, dateTo)) {
        return true;
    }

    return false;
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

        if (imageUserId === userId && containsTag(caption)) {
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
 * @returns {boolean}
 */
function hasPrintTagInComments(user, image, dateFrom, dateTo) {
    var hasTag = false;
    var userId = user.instagram.id;

    if (!!image.metadata.comments) {
        var comments = image.metadata.comments.data;

        _.forEach(comments, function(comment) {
            /**
             * Check that the comment was made by the current user and that it also contains the tag
             */
            if (comment.from.id === userId && containsTag(comment.text)) {
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
                        return;
                    }
                } else if (!!dateFrom && !dateTo) {
                    if (taggedOn.isAfter(dateFrom)) {
                        image.taggedOn = taggedOn;
                        image.tag = tag;
                        hasTag = true;
                        return;
                    }
                } else if (!dateFrom && !!dateTo) {
                    if (taggedOn.isBefore(dateTo)) {
                        image.taggedOn = taggedOn;
                        image.tag = tag;
                        hasTag = true;
                        return;
                    }
                } else {
                    image.tag = tag;
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
 * Tests if there is an ignore by the user in the caption.
 *
 * @param user
 * @param image
 * @returns {boolean}
 */
function hasIgnoredInCaption(user, image) {
    var userId = user.instagram.id;

    if (!!image.metadata.caption && !!image.metadata.user.id) {
        var imageUserId = image.metadata.user.id;
        var caption = image.metadata.caption.text;

        return imageUserId === userId && isIgnored(caption);
    }

    return false;
}

/**
 * Tests if there is an ignore by the user in the comments.
 *
 * @param user
 * @param image
 * @returns {boolean}
 */
function hasIgnoredInComments(user, image) {
    var hasIgnore = false;
    var userId = user.instagram.id;

    if (!!image.metadata.comments) {
        var comments = image.metadata.comments.data;

        _.forEach(comments, function(comment) {
            if (comment.from.id === userId && isIgnored(comment.text)) {
                hasIgnore = true;
                return;
            }
        });
    }

    return hasIgnore;
}

/**
 * Tests if the post contains an ignore tag in the caption or comments.
 *
 * @param user
 * @param image
 * @returns {boolean}
 */
function hasIgnoreTag(user, image) {
    return hasIgnoredInCaption(user, image) || hasIgnoredInComments(user, image);
}

/**
 * Checks if the text contains an ignore tag
 *
 * @param text
 * @returns {boolean}
 */
function isIgnored(text) {
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
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new InstagramManager();

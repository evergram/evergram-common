/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var _ = require('lodash');
var config = require('../../config').instagram;
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
InstagramManager.prototype.findPrintableImagesByUser = function (user) {
    var deferred = q.defer();

    this.findImagesByUser(user).then(function (images) {
        var printableImages = [];
        _.forEach(images, function (image) {
            if (hasPrintTag(user, image)) {
                printableImages.push(image);
            }
        });
        deferred.resolve(printableImages);
    }, function (err) {
        deferred.reject(err);
    });

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
        deferred.reject('No instagram id for user' + user._id);
    } else {
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
        })
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
        if (!!pagination.next) {
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
        if (!!pagination.next) {
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
function hasPrintTag(user, image) {
    /**
     * If the image is by this user, we check the caption
     */
    if (hasPrintTagInCaption(user, image)) {
        return true;
    }
    /**
     * We check the comments for the tag by the current user
     */
    else if (hasPrintTagInComments(user, image)) {
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
function hasPrintTagInCaption(user, image) {
    var imageUserId = image.metadata.user;
    var userId = user.instagram.id;
    var caption = image.metadata.caption.text;

    if (imageUserId == userId && caption.toLowerCase().indexOf(config.printTag) > -1) {
        return true;
    }
    return false;
}

/**
 * Tests whether any comments contain the print tag
 *
 * @param comments
 * @returns {boolean}
 */
function hasPrintTagInComments(user, image) {
    var hasTag = false;
    var userId = user.instagram.id;
    var comments = image.metadata.comments.data;

    _.forEach(comments, function (comment) {
        /**
         * Check that the comment was made by the current user and that it also contains the tag
         */
        if (comment.from.id == userId && comment.text.toLowerCase().indexOf(config.printTag) > -1) {
            hasTag = true;
            return;
        }
    });

    return hasTag;
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

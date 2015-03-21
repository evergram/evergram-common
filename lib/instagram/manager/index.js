/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var Q = require('q');
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
 * @returns {promise|*|Q.promise}
 */
InstagramManager.prototype.findUser = function (userId) {
    var deferred = Q.defer();
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
 * @returns {promise|*|Q.promise}
 */
InstagramManager.prototype.findPrintableImagesByUser = function (user) {
    var deferred = Q.defer();

    this.findImagesByUser(user).then(function (images) {
        var printableImages = [];
        for (var i in images) {
            if (hasPrintTag(images[i].metadata)) {
                printableImages.push(images[i]);
            }
        }
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
 * @returns {promise|*|Q.promise}
 */
InstagramManager.prototype.findImagesByUser = function (user) {
    var deferred = Q.defer();

    if (!user.instagram || !user.instagram.id) {
        deferred.reject('No instagram id for user' + user._id);
    } else {
        var api = new Api(user);
        this.findImages(api, 'user_media_recent', user.instagram.id).then(function (images) {
            deferred.resolve(images);
        });
    }

    return deferred.promise;
};

/**
 *
 * @param endpoint
 * @param id
 * @param offset
 * @param limit
 * @returns {promise|*|Q.promise}
 */
InstagramManager.prototype.findImages = function (api, endpoint, id, offset, limit) {
    var deferred = Q.defer();
    var images = [];

    api[endpoint](id, function (err, results, remaining, limit) {
        for (var i in results) {
            var image = instagramImageMapper.toModel(results[i]);
            images.push(image);
        }
        deferred.resolve(images);
    });

    return deferred.promise;
};

/**
 * A test to see if a post contains the tags to inidicate it is printable.
 *
 * @param post
 * @returns {boolean}
 */
function hasPrintTag(post) {
    if (!!post.caption && !!post.caption.text) {
        var caption = post.caption.text.toLowerCase();
        if (caption.indexOf(config.printTag) > -1) {
            return true;
        }
    }
    return false;
}

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new InstagramManager;

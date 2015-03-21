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
    var imageSets = [];

    if (!user.instagram || !user.instagram.id) {
        deferred.reject('No instagram id for user' + user._id);
    } else {
        var deferreds = [];
        var likedDeferred = Q.defer();
        var recentDeferred = Q.defer();

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

        Q.all(deferreds).then(function () {
            console.log(imageSets);
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
 * @returns {promise|*|Q.promise}
 */
function getUserMediaLiked(api, options) {
    var deferred = Q.defer();
    var images = [];
    var currentPage = 0;

    if (!options) {
        options = {};
    }

    var callback = function (err, results, pagination, remaining, limit) {
        for (var i in results) {
            var image = instagramImageMapper.toModel(results[i]);
            images.push(image);
        }

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
 * @returns {promise|*|Q.promise}
 */
function getUserMediaRecent(api, userId, options) {
    var deferred = Q.defer();
    var images = [];
    var currentPage = 0;

    if (!options) {
        options = {};
    }

    var callback = function (err, results, pagination, remaining, limit) {
        for (var i in results) {
            var image = instagramImageMapper.toModel(results[i]);
            images.push(image);
        }

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
 *
 * @param imageSets
 * @returns {T|*}
 */
function combineImageSets(imageSets) {
    var imageSet = imageSets.pop();

    var contains = function (images, image) {
        for (var i in images) {
            if (image._id == images[i]._id) {
                return true;
            }
        }
        return false;
    };

    for (var i in imageSets) {
        for (var j in imageSets[i]) {
            if (!contains(imageSet, imageSets[i][j])) {
                imageSet.push(imageSets[i][j]);
            }
        }
    }

    return imageSet;
}

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new InstagramManager;

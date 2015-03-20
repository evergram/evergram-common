/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var Q = require('q');
var config = require('../../config').instagram;
var instagramImageMapper = require('../../mapper').instagramImage;

/**
 * A manager which provides a simple api to interact with Instagram.
 *
 * @param user
 * @constructor
 */
function InstagramManager(user) {
    this.api = require('instagram-node').instagram();

    if (!user) {
        this.initApi();
    } else {
        this.initApiWithUser(user);
    }
}

/**
 * Allow new instances of the manager to be instantiated.
 *
 * @type {InstagramManager}
 */
InstagramManager.prototype.InstagramManager = InstagramManager;

/**
 * Initialize the api with the passed credentials.
 * It will default to the application credentials from config if none are passed.
 *
 * @param credentials
 */
InstagramManager.prototype.initApi = function (credentials) {
    /**
     * No credentials found so use the application creds.
     */
    if (!credentials) {
        credentials = {
            client_id: config.clientID,
            client_secret: config.clientSecret
        };
    }

    this.api.use(credentials);
};

/**
 * Uses the user auth token to initialise the api.
 *
 * @param user
 */
InstagramManager.prototype.initApiWithUser = function (user) {
    this.api.use({
        access_token: user.authToken
    });
};

/**
 * Finds an instagram user from the passed id.
 *
 * @param userId
 * @returns {promise|*|Q.promise}
 */
InstagramManager.prototype.findUser = function (userId) {
    var deferred = Q.defer();

    this.api.user(userId, function (err, user, remaining, limit) {
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
InstagramManager.prototype.findImagesByUser = function (user) {
    var deferred = Q.defer();

    if (!user.instagram || !user.instagram.id) {
        deferred.reject('No instagram id for user' + user._id);
    } else {
        this.findImages('user_media_recent', user.instagram.id).then(function(images){
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
InstagramManager.prototype.findImages = function (endpoint, id, offset, limit) {
    var deferred = Q.defer();
    var images = [];

    this.api[endpoint](id, function (err, results, remaining, limit) {
        for (var i in results) {
            var image = instagramImageMapper.toModel(results[i]);
            images.push(image);
        }
        deferred.resolve(images);
    });

    return deferred.promise;
}

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

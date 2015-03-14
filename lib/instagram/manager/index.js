/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var Q = require('q');
var config = require('../../config').instagram;
var Image = require('../../models').Image;

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
InstagramManager.prototype.findPrintablePosts = function (user) {
    var images = [];
    var deferred = Q.defer();
    if (!user.instagram || !user.instagram.data.id) {
        deferred.reject('No instagram id for user' + user._id);
    } else {
        this.api.user_media_recent(user.instagram.data.id, function (err, results, remaining, limit) {
            for (var i in results) {
                var post = results[i];

                if (hasPrintTag(post)) {
                    var image = new Image({
                        date: new Date(post.created_time * 1000),
                        src: {
                            raw: post.images.standard_resolution.url
                        },
                        metadata: post
                    });
                    images.push(image);
                }
            }
            deferred.resolve(images);
        });
    }

    return deferred.promise;
};

/**
 * Saves all passed images to the database.
 *
 * @param images
 * @returns {promise|*|Q.promise}
 */
InstagramManager.prototype.saveImages = function (images) {
    var deferred = Q.defer();

    Image.create(images, function (err) {
        if (!!err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
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

/**
 * Module dependencies.
 */

var Q = require('q');
var config = require('../../config').instagram;
var Image = require('../../models').Image;

/**
 * Expose
 */

function Manager() {
    this.api = require('instagram-node').instagram();
    this.api.use({
        client_id: config.clientID,
        client_secret: config.clientSecret
    });
}

Manager.prototype.findUser = function (err, userId) {
    this.api.user(userId, function (err, result, remaining, limit) {

    });
};

Manager.prototype.findPrintablePosts = function (err, user, callback) {
    var images = [];
    if (!user.instagram && !user.instagram.id) {
        callback('No instagram id for user' + user._id, []);
    }

    this.api.user_media_recent(user.instagram.id, function (err, results, remaining, limit) {
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

        if (!!callback) {
            callback(err, images);
        }
    });
};

Manager.prototype.saveImages = function (err, images, callback) {
    Image.create(images, function (err) {
        if (!!callback) {
            callback(err);
        }
    });
};

function hasPrintTag(post) {
    if (!!post.caption && !!post.caption.text) {
        var caption = post.caption.text.toLowerCase();
        if (caption.indexOf(config.printTag) > -1) {
            return true;
        }
    }
    return false;
}

module.exports = exports = new Manager;

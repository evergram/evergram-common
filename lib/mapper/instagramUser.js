/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var User = require('../models').User;

function InstagramUser() {
}

/**
 * Converts to a model
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
InstagramUser.prototype.toModel = function(data, user) {

    if (!user) {
        user = new User();
    }

    user.instagram = {
        id: data._json.data.id,
        username: data._json.data.username,
        authToken: data.authToken,
        follows: data._json.data.counts.follows,
        followers: data._json.data.counts.followed_by,
        media: data._json.data.counts.media,
        profilePicture: data._json.data.profile_picture,
        website: data._json.data.website,
        bio: data._json.data.bio
    };

    return user;
};

module.exports = exports = new InstagramUser();

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
InstagramUser.prototype.toModel = function (data) {
    return new User({
        name: data._json.data.full_name,
        instagram: {
            id: data._json.data.id,
            username: data._json.data.username,
            authToken: data.accessToken,
            follows: data._json.data.counts.follows,
            followers: data._json.data.counts.followed_by,
            media: data._json.data.counts.media,
            profilePicture: data._json.data.counts.profile_picture,
            website: data._json.data.counts.website,
            bio: data._json.data.counts.bio
        }
    });
};

module.exports = exports = new InstagramUser;

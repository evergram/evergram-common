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
    var firstName;
    var lastName;

    if (!user) {
        user = new User();
    }

    if (!!data._json.data.full_name && data._json.data.full_name.length > 0) {
        var fullName = data._json.data.full_name.split(' ');
        if (!!fullName[0]) {
            firstName = fullName[0];
        }

        if (!!fullName[1]) {
            lastName = fullName[1];
        }
    }

    user.firstName = !!firstName ? firstName : user.firstName;
    user.lastName = !!lastName ? lastName : user.lastName;
    user.instagram = {
        id: data._json.data.id,
        username: data._json.data.username,
        authToken: data.authToken,
        follows: data._json.data.counts.follows,
        followers: data._json.data.counts.followed_by,
        media: data._json.data.counts.media,
        profilePicture: data._json.data.counts.profile_picture,
        website: data._json.data.counts.website,
        bio: data._json.data.counts.bio
    };

    return user;
};

module.exports = exports = new InstagramUser();

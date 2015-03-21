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
 * @returns {promise|*|Q.promise}
 */
InstagramUser.prototype.toModel = function (data) {
    if (!data.createdOn || !(data.createdOn instanceof Date)) {
        data.createdOn = new Date();
    }
    data.createdOn.setHours(0, 0, 0, 0);

    return new User({
        name: data.displayName,
        username: data.username,
        instagram: {
            id: data._json.data.id,
            authToken: data.accessToken,
            profile: data._json
        }
    });
};

module.exports = exports = new InstagramUser;

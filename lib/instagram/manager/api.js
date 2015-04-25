/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var config = require('../../config').instagram;

/**
 * A wrapper for the instagram api that can be initialized with user credentials
 *
 * @param user
 * @returns {*}
 * @constructor
 */
function InstagramApi(user) {
    var api = require('instagram-node').instagram();

    if (!!user) {
        if (!!user.instagram && !!user.instagram.authToken) {
            api.use({
                access_token: user.instagram.authToken
            });
        } else {
            throw 'User ' + user.getUsername() + ' does not have an authToken';
        }
    } else {
        api.use({
            client_id: config.clientID,
            client_secret: config.clientSecret
        });
    }

    return api;
}

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = InstagramApi;

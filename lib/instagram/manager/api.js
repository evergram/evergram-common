/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var config = require('../../config').instagram;

/**
 * A wrapper for the instagram api that can be initialized with user credentials
 *
 * @param user
 * @constructor
 */
function InstagramApi(user) {
    var api = require('instagram-node').instagram();

    if (!user || !user.authToken) {
        api.use({
            client_id: config.clientID,
            client_secret: config.clientSecret
        });
    } else {
        api.use({
            access_token: user.authToken
        });
    }

    return api;
}

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = InstagramApi;

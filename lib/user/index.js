/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A user service that contains a manager
 *
 * @constructor
 */
function UserService() {
    this.manager = require('./manager');
}

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new UserService();
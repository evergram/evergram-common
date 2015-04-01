/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * An email service
 *
 * @constructor
 */
function EmailService() {
    this.manager = require('./manager');
}

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new EmailService;
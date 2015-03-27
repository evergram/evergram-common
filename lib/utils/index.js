/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A utils service
 *
 * @constructor
 */
function UtilsService() {
    this.files = require('./files');
    this.logger = require('./logger');
}

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new UtilsService;
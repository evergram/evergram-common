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
 * @type {UtilsService}
 */
module.exports = exports = new UtilsService;
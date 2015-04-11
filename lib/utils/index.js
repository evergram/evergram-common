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
    this.object = require('./object');
}

/**
 * Expose
 * @type {UtilsService}
 */
module.exports = exports = new UtilsService;
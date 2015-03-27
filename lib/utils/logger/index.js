/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A utils service for logging
 *
 * @constructor
 */
function LoggerUtilService() {

}

/**
 * Log an error.
 *
 * @param messages
 */
LoggerUtilService.prototype.error = function () {
    console.error(arguments);
};

/**
 * Log a warning.
 *
 * @param messages
 */
LoggerUtilService.prototype.warning = function () {
    console.warn(arguments);
};

/**
 * Log an info.
 *
 * @param message
 */
LoggerUtilService.prototype.ingo = function () {
    console.info(arguments);
};

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new LoggerUtilService;
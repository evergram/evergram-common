/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');

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
    _.forEach(arguments, function (argument) {
        console.error(getNow(), argument);
    });
};

/**
 * Log a warning.
 *
 * @param messages
 */
LoggerUtilService.prototype.warning = function () {
    _.forEach(arguments, function (argument) {
        console.warn(getNow(), argument);
    });
};

/**
 * Log an info.
 *
 * @param message
 */
LoggerUtilService.prototype.info = function () {
    _.forEach(arguments, function (argument) {
        console.info(getNow(), argument);
    });
};

function getNow() {
    return (new Date()).toDateString() + ' ' + (new Date()).toTimeString();
}

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new LoggerUtilService;
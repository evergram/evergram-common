/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
var winston = require('winston');
require('winston-mongodb').MongoDB;
var config = require('../../config').logger;

/**
 * A utils service for logging
 *
 * @constructor
 */
function LoggerUtilService() {
    this.logger = new (winston.Logger);

    //add transports
    _.forEach(config.transports, (function (transport) {
        if (!!winston.transports[transport] && !!config[transport]) {
            this.logger.add(winston.transports[transport], config[transport]);
        }
    }).bind(this));
}

/**
 * Log an error.
 *
 * @param messages
 */
LoggerUtilService.prototype.error = function () {
    _.forEach(arguments, (function (argument) {
        this.logger.error(argument);
    }).bind(this));
};

/**
 * Log a warning.
 *
 * @param messages
 */
LoggerUtilService.prototype.warning = function () {
    _.forEach(arguments, (function (argument) {
        this.logger.warn(argument);
    }).bind(this));
};

/**
 * Log an info.
 *
 * @param message
 */
LoggerUtilService.prototype.info = function () {
    _.forEach(arguments, (function (argument) {
        this.logger.info(argument);
    }).bind(this));
};

function getNow() {
    return (new Date()).toDateString() + ' ' + (new Date()).toTimeString();
}

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new LoggerUtilService;
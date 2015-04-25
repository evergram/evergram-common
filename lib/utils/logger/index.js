/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
var config = require('../../config').logger;
var winston = require('winston');
require('winston-mongodb').MongoDB;
require('winston-papertrail').Papertrail;

/**
 * A utils service for logging
 *
 * @constructor
 */
function LoggerUtilService() {
    this.logger = new (winston.Logger);

    //add transports
    _.forEach(config.transports, (function(transport) {
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
LoggerUtilService.prototype.error = function() {
    _.forEach(arguments, (function(argument) {
        this.logger.error(config.prefix, argument);
    }).bind(this));
};

/**
 * Log a warning.
 *
 * @param messages
 */
LoggerUtilService.prototype.warning = function() {
    _.forEach(arguments, (function(argument) {
        this.logger.warn(config.prefix, argument);
    }).bind(this));
};

/**
 * Log an info.
 *
 * @param message
 */
LoggerUtilService.prototype.info = function() {
    _.forEach(arguments, (function(argument) {
        this.logger.info(config.prefix, argument);
    }).bind(this));
};

/**
 * Log.
 *
 * @param message
 */
LoggerUtilService.prototype.log = function() {
    _.forEach(arguments, (function(argument) {
        this.logger.log(config.prefix, argument);
    }).bind(this));
};

function getNow() {
    return (new Date()).toDateString() + ' ' + (new Date()).toTimeString();
}

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new LoggerUtilService();
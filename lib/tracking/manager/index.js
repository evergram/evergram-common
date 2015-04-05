/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var User = require('../../models').User;

/**
 * A manager that provides tracking of events.
 *
 * @constructor
 */
function TrackingManager() {

}

/**
 *
 * @param user
 * @param event
 * @param data
 */
TrackingManager.prototype.trackEvent = function (user, event, data) {

};

TrackingManager.prototype.createUser = function (user) {

};

TrackingManager.prototype.updateUser = function (user) {

};

TrackingManager.prototype.incrementField = function (user, field, amount) {

};

/**
 * Expose
 * @type {TrackingManager}
 */
module.exports = exports = new TrackingManager;

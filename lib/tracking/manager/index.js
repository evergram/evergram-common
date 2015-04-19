/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var Analytics = require('analytics-node');
var config = require('../../config').tracking;
var User = require('../../models').User;

/**
 * A manager that provides tracking of events.
 *
 * @constructor
 */
function TrackingManager() {
    this.analytics = new Analytics(config.writeKey, config.options);
}

/**
 * Tracks a given event with the passed data.
 *
 * @param user
 * @param event
 * @param data
 */
TrackingManager.prototype.trackEvent = function (user, event, properties, timestamp) {
    var data = {
        userId: _.isString(user._id) ? user._id : user._id.toString(),
        event: event,
        properties: properties
    };

    if (!!timestamp) {
        data.timestamp = timestamp;
    }

    //stamp user data
    data.instagramUsername = user.instagram.username;
    data.plan = user.billing.option;
    data.city = user.address.suburb;
    data.state = user.address.state;
    data.postcode = user.address.postcode;
    data.country = user.address.country;

    return q.ninvoke(this.analytics, 'track', data);
};

/**
 * Creates a user and adds an alias based on the current username.
 *
 * @param user
 */
TrackingManager.prototype.createUser = function (user) {
    var data = {
        userId: user._id.toString(),
        traits: {
            createdAt: (user.createdOn).toISOString(),
            name: user.firstName + ' ' + user.lastName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            plan: user.billing.option,
            suburb: user.address.suburb,
            postcode: user.address.postcode,
            state: user.address.state,
            country: user.address.country,
            instagramUsername: user.instagram.username,
            currentPeriod: user.getCurrentPeriod()
        },
        timestamp: moment(user.createdOn).toDate()
    };

    return q.ninvoke(this.analytics, 'identify', data);
};

/**
 * Expose
 * @type {TrackingManager}
 */
module.exports = exports = new TrackingManager;

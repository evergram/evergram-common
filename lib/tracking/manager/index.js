/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var Analytics = require('analytics-node');
var config = require('../../config').tracking;
var logger = require('../../utils').logger;

/**
 * A manager that provides tracking of events.
 *
 * @constructor
 */
function TrackingManager() {
    if (!!config.writeKey) {
        this.analytics = new Analytics(config.writeKey, config.options);
    } else {
        logger.error('Missing write key for Segment');
    }
}

/**
 * Tracks a given event with the passed data.
 *
 * @param user
 * @param event
 * @param data
 */
TrackingManager.prototype.trackEvent = function(user, event, properties, timestamp) {

    // append traits to properties (needed to expose traits to some platforms, e.g. keen.io and autopilot)
    properties.instagramUsername = user.instagram.username;
    properties.plan = user.billing.option;
    properties.city = user.address.suburb;
    properties.state = user.address.state;
    properties.postcode = user.address.postcode;
    properties.country = user.address.country;

    var data = {
        userId: _.isString(user._id) ? user._id : user._id.toString(),
        event: event,
        properties: properties
    };

    if (!!timestamp) {
        data.timestamp = timestamp;
    }

    //stamp user data
    data.context = {
        traits: {
            instagramUsername: user.instagram.username,
            plan: user.billing.option,
            city: user.address.suburb,
            state: user.address.state,
            postcode: user.address.postcode,
            country: user.address.country
        }
    };

    //return q.defer().promise
    return q.ninvoke(this.analytics, 'track', data).
        then(function() {
            logger.info('Tracked "' + event + '" for ' + user.instagram.username);
        });
};

/**
 * Creates a user and adds an alias based on the current username.
 *
 * @param user
 */
TrackingManager.prototype.createUser = function(user) {
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

    return q.ninvoke(this.analytics, 'identify', data).
        then(function() {
            logger.info('Tracked "created a user" for ' + user.instagram.username);
        });
};

/**
 * Expose
 * @type {TrackingManager}
 */
module.exports = exports = new TrackingManager();

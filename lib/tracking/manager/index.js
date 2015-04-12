/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var Mixpanel = require('mixpanel');
var config = require('../../config').tracking;
var User = require('../../models').User;

/**
 * A manager that provides tracking of events.
 *
 * @constructor
 */
function TrackingManager() {
    if (!!config.apiKey) {
        this.mixpanel = Mixpanel.init(config.token, {key: config.apiKey, verbose: true});
    } else {
        this.mixpanel = Mixpanel.init(config.token);
    }
}

/**
 * Tracks a given event with the passed data.
 *
 * @param user
 * @param event
 * @param data
 */
TrackingManager.prototype.trackEvent = function (user, event, data) {
    if (_.isEmpty(data.distinct_id)) {
        data.distinct_id = user._id;
    }
    return q.ninvoke(this.mixpanel, 'track', event, data);
};

/**
 * Creates a user and adds an alias based on the current username.
 *
 * @param user
 */
TrackingManager.prototype.createUser = function (user) {
    var data = {
        $first_name: user.firstName,
        $last_name: user.lastName,
        $email: user.email,
        $created: (user.createdOn).toISOString(),
        Plan: user.billing.option,
        Suburb: user.address.suburb,
        Postcode: user.address.postcode,
        State: user.address.state,
        Country: user.address.country,
        Active: user.active,
        'Instagram Username': user.instagram.username,
        'Current Period': user.getCurrentPeriod()
    };

    return q.ninvoke(this.mixpanel.people, 'set', user._id, data).then((function (result) {
        return q.ninvoke(this.mixpanel, 'alias', user._id, user.getUsername());
    }).bind(this));
};

/**
 * Updates a user. Note, at the moment this is the same as a create.
 *
 * @param user
 */
TrackingManager.prototype.updateUser = function (user) {
    return this.createUser(user);
};

/**
 * Increments a particular field a given amount
 *
 * @param user
 * @param field
 * @param amount
 */
TrackingManager.prototype.incrementField = function (user, field, amount) {
    return q.ninvoke(this.mixpanel.people, 'increment', user._id, field, amount);
};

/**
 * Increment a key value pair.
 *
 * @param user
 * @param data
 */
TrackingManager.prototype.incrementMultiple = function (user, data) {
    return q.ninvoke(this.mixpanel.people, 'increment', user._id, data);
};

/**
 * Sets a value on an individual field
 *
 * @param user
 * @param field
 * @param value
 */
TrackingManager.prototype.setField = function (user, field, value) {
    return q.ninvoke(this.mixpanel.people, 'set', user._id, field, value);
};

/**
 *
 * @param user
 * @param field
 * @param value
 */
TrackingManager.prototype.importSignup = function (user) {
    var data = {
        distinct_id: user._id,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        Email: user.email,
        Plan: user.billing.option,
        Suburb: user.address.suburb,
        Postcode: user.address.postcode,
        State: user.address.state,
        Country: user.address.country,
        'Instagram Username': user.instagram.username
    };

    return q.ninvoke(this.mixpanel, 'import', '$signup', moment(user.createdOn).unix(), data);
};

/**
 * Imports an event at a particular date in the past.
 *
 * @param user
 * @param event
 * @param date
 * @param data
 */
TrackingManager.prototype.importEvent = function (user, event, date, data) {
    if (_.isEmpty(data.distinct_id)) {
        data.distinct_id = user._id;
    }

    return q.ninvoke(this.mixpanel, 'import', event, moment(date).unix(), data);
};

/**
 * Expose
 * @type {TrackingManager}
 */
module.exports = exports = new TrackingManager;

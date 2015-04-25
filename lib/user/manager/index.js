'use strict';
/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var logger = require('../../utils').logger;
var User = require('../../models').User;

/**
 * A manager that provides an api to common user functionality.
 *
 * @constructor
 */
function UserManager() {

}

/**
 * Find a single User.
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.find = function(options) {
    if (!options) {
        options = {
            criteria: {}
        };
    } else if (!options.criteria) {
        options.criteria = {};
    }

    var query = User.findOne(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    return q.ninvoke(query, 'exec');
};

/**
 * Finds many Users.
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.findAll = function(options) {
    if (!options) {
        options = {
            criteria: {}
        };
    } else if (!options.criteria) {
        options.criteria = {};
    }

    var query = User.find(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    return q.ninvoke(query, 'exec');
};

/**
 * Create a User.
 *
 * @param data
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.create = function(user) {
    return q.ninvoke(user, 'save').then(function() {
        logger.info('User ' + user.getUsername() + ' successfully saved.');
        return user;
    });
};

/**
 * Update a User.
 *
 * @param data
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.update = function(user) {
    return q.ninvoke(user, 'save').then(function() {
        logger.info('User ' + user.getUsername() + ' successfully updated.');
        return user;
    });
};

/**
 * Expose
 * @type {UserManager}
 */
module.exports = exports = new UserManager();

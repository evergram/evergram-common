'use strict';
/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
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
 * Finds a user by it's id.
 *
 * @param id
 * @param options
 * @returns {Promise}
 */
UserManager.prototype.findById = function(id, options) {
    if (!options) {
        options = {};
    }

    options.criteria = {
        _id: id
    };

    return this.find(options);
};

/**
 * Find a single User.
 *
 * @param options
 * @returns {Promise}
 */
UserManager.prototype.find = function(options) {
    logger.info("### Find: " + JSON.stringify(options));
    if (!options) {
        options = {
            criteria: {}
        };
    } else if (!options.criteria) {
        options.criteria = {};
    }

    var query = User.findOne(options.criteria);

    if (!!options.lean) {
        query.lean();
    }

    if (!!options.select) {
        query.select(options.select);
    }

    return executeQuery(query);
};

/**
 * Finds many Users.
 *
 * @param options
 * @returns {Promise}
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

    if (!!options.lean) {
        query.lean();
    }

    if (!!options.select) {
        query.select(options.select);
    }

    return executeQuery(query);
};

/**
 * Create a User.
 *
 * @param data
 * @returns {Promise}
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
 * @returns {Promise}
 */
UserManager.prototype.update = function(user) {
    return q.ninvoke(user, 'save').then(function() {
        logger.info('User ' + user.getUsername() + ' successfully updated.');
        return user;
    });
};

/**
 * Find and update a User.
 *
 * @param id
 * @param userData
 * @returns {Promise}
 */
UserManager.prototype.findAndUpdate = function(id, userData) {
    return this.findById(id).
    then(function(user) {
        if (!!user) {
            var updatedUser = _.merge(user, userData);
            // update data
            return this.update(updatedUser);
        }
        return q.reject('User ' + id + ' not found');
    }.bind(this));
};

/**
 * Helper function because q.ninvoke isn't working with the latest mongoose.
 *
 * @param query
 * @returns {Promise}
 */
function executeQuery(query) {
    var deferred = q.defer();

    query.exec(function(err, results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(results);
        }
    });

    return deferred.promise;
}

/**
 * Expose
 * @type {UserManager}
 */
module.exports = exports = new UserManager();

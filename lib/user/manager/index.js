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
 * Finds a user by it's id.
 *
 * @param id
 * @param options
 * @returns {promise|*|q.promise}
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
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.create = function(user) {
    var deferred = q.defer();

    user.save(function(err, doc) {
        if (err) {
            deferred.reject(err);
        } else {
            logger.info('User ' + doc.getUsername() + ' successfully saved.');
            deferred.resolve(doc);
        }
    });

    return deferred.promise;
};

/**
 * Update a User.
 *
 * @param data
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.update = function(user) {
    return this.create(user);
};

/**
 * Find and update a User.
 *
 * @param id
 * @param userData
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.findAndUpdate = function(id, userData) {
    return q.ninvoke(User, 'findOneAndUpdate', {_id: id}, userData, {new: true}).
        then(function(user) {
            logger.info('User ' + user.getUsername() + ' successfully updated.');
            return user;
        });
};

/**
 * TODO remove when fix is in.
 * Helper function because q.ninvoke isn't working with the latest mongoose.
 *
 * @param query
 * @returns {*|promise}
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

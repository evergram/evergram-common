/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
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
UserManager.prototype.find = function (options) {
    var deferred = q.defer();

    if (!options) {
        options = {};
    }

    var query = User.findOne(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    query.exec(function (err, users) {
        deferred.resolve(users);
    });

    return deferred.promise;
};

/**
 * Finds many Users.
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.findAll = function (options) {
    var deferred = q.defer();

    if (!options) {
        options = {};
    }

    var query = User.find(options.criteria);
    if (!!options.select) {
        query.select(options.select);
    }

    query.exec(function (err, users) {
        deferred.resolve(users);
    });

    return deferred.promise;
};

/**
 * Save a User.
 *
 * @param data
 * @returns {promise|*|q.promise}
 */
UserManager.prototype.save = function (user) {
    var deferred = q.defer();

    user.save(function (err) {
        if (!err) {
            deferred.resolve(user);
        } else {
            deferred.reject(err);
        }
    });

    return deferred.promise;
};

/**
 * Expose
 * @type {UserManager}
 */
module.exports = exports = new UserManager;

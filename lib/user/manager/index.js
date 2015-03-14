/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var Q = require('q');
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
 * @returns {promise|*|Q.promise}
 */
UserManager.prototype.findUser = function (options) {
    var deferred = Q.defer();

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
 * @returns {promise|*|Q.promise}
 */
UserManager.prototype.findUsers = function (options) {
    var deferred = Q.defer();

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
 * Create a User.
 *
 * @param data
 * @returns {promise|*|Q.promise}
 */
UserManager.prototype.create = function (data) {
    var deferred = Q.defer();

    var user = new User(data);

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

/**
 * Module dependencies.
 */

var Q = require('q');
var User = require('../../models').User;

/**
 * Expose
 */

function UserManager() {

}

UserManager.prototype.findUser = function (options) {
    var deferred = Q.defer();

    var query = User.findOne(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    query.exec(function (err, users) {
        console.log(users);
        deferred.resolve(users);
    });

    return deferred.promise;
};

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

module.exports = exports = new UserManager;

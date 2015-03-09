/**
 * Module dependencies.
 */

var Q = require('q');
var User = require('../../models').User;
var AWS = require('aws-sdk');

/**
 * Expose
 */

function S3Manager() {
    this.s3 = new AWS.S3();
}

S3Manager.prototype.create = function (options) {
    var deferred = Q.defer();


    return deferred.promise;
};

S3Manager.prototype.get = function (options) {
    var deferred = Q.defer();


    return deferred.promise;
};

S3Manager.prototype.delete = function (options) {
    var deferred = Q.defer();


    return deferred.promise;
};

module.exports = exports = new S3Manager;

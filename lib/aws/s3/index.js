/**
 * Module dependencies.
 */

var q = require('q');
var User = require('../../models').User;
var AWS = require('aws-sdk');
var fs = require('fs');

/**
 * Expose
 */

function S3Manager() {
    this.s3 = new AWS.S3();
}

S3Manager.prototype.create = function (file, options) {
    var deferred = q.defer();

    var params = {
        Bucket: options.bucket,
        Key: options.key,
        Body: fs.createReadStream(file)
    };

    s3.putObject(params, function (err, data) {
        deferred.resolve(data);
    });

    return deferred.promise;
};

S3Manager.prototype.get = function (options) {
    var deferred = q.defer();


    return deferred.promise;
};

S3Manager.prototype.delete = function (options) {
    var deferred = q.defer();


    return deferred.promise;
};

module.exports = exports = new S3Manager;

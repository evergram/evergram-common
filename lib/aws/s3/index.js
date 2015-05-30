/**
 * Module dependencies.
 */

var q = require('q');
var AWS = require('aws-sdk');
var fs = require('fs');

/**
 * Expose
 */

function S3Manager() {
    this.s3 = new AWS.S3();
}

S3Manager.prototype.create = function(file, options) {
    var params = {
        Bucket: options.bucket,
        Key: options.key,
        Body: fs.createReadStream(file),
        ACL: options.acl || 'private'
    };

    return q.ninvoke(this.s3, 'upload', params);
};

S3Manager.prototype.get = function(options) {
    var params = {
        Bucket: options.bucket,
        Key: options.key
    };

    return q.ninvoke(this.s3, 'getObject', params);
};

S3Manager.prototype.deleteFile = function(options) {
    var params = {
        Bucket: options.bucket,
        Key: options.key
    };

    return q.ninvoke(this.s3, 'deleteObject', params);
};

S3Manager.prototype.deleteDir = function(options) {
    var deferred = q.defer();

    var params = {
        Bucket: options.bucket,
        Key: options.key
    };

    this.s3.listObjects(params, (function(err, data) {
        if (err) {
            return console.log(err);
        }

        params = {Bucket: options.bucket};
        params.Delete = {};
        params.Delete.Objects = [];

        //TODO add 1000 item limit handling
        data.Contents.forEach(function(content) {
            params.Delete.Objects.push({Key: content.Key});
        });

        this.s3.deleteObjects(params, function(err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
    }).bind(this));

    return deferred.promise;
};

module.exports = exports = new S3Manager();

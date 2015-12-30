/**
 * Module dependencies.
 */

var _ = require('lodash');
var q = require('q');
var AWS = require('aws-sdk');
var fs = require('fs');

/**
 * Expose
 */
function S3Manager() {
    this.s3 = new AWS.S3();
}

/**
 * Create a file on S3.
 *
 * @param file
 * @param options
 * @returns {*}
 */
S3Manager.prototype.create = function(file, options) {
    var params = {
        Bucket: options.bucket,
        Key: options.key,
        Body: fs.createReadStream(file),
        ACL: options.acl || 'private'
    };

    return q.ninvoke(this.s3, 'upload', params);
};

/**
 * Get a file from S3.
 *
 * @param options
 * @returns {*}
 */
S3Manager.prototype.get = function(options) {
    var params = {
        Bucket: options.bucket,
        Key: options.key
    };

    return q.ninvoke(this.s3, 'getObject', params);
};

/**
 * Delete a file from S3
 *
 * @param options
 * @returns {*}
 */
S3Manager.prototype.deleteFile = function(options) {
    var params = {
        Bucket: options.bucket,
        Key: options.key
    };

    return q.ninvoke(this.s3, 'deleteObject', params);
};

/**
 * Delete all passed files in batches of 1000 from S3.
 *
 * @param files
 * @param options
 * @returns {*}
 */
S3Manager.prototype.deleteFiles = function(files, options) {
    var params = {
        Bucket: options.bucket,
        Delete: {
            Objects: []
        }
    };

    _.forEach(files, function(file) {
        params.Delete.Objects.push(file);
    });

    return q.ninvoke(this.s3, 'deleteObjects', params);
};

/**
 * Delete a folder and all files from S3
 *
 * @param options
 */
S3Manager.prototype.deleteDir = function(options) {
    return this.list(options).
    then((function(data) {
        var files = [];

        //TODO add 1000 item limit handling
        _.forEach(data.Contents, function(content) {
            files.push({Key: content.Key});
        });

        return this.deleteFiles(files, {
            bucket: options.bucket
        });
    }).bind(this));
};

/**
 * List all files within a folder on S3.
 *
 * @param options
 * @returns {*}
 */
S3Manager.prototype.list = function(options) {
    var params = {
        Bucket: options.bucket,
        Prefix: options.key
    };

    return q.ninvoke(this.s3, 'listObjects', params);
};

module.exports = exports = new S3Manager();

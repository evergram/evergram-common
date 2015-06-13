/**
 * Module dependencies
 */

var AWS = require('aws-sdk');
var config = require('../config').aws;

function AwsService() {
    //set the config
    AWS.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: config.region
    });

    this.s3 = require('./s3');
    this.sqs = require('./sqs');
}

module.exports = exports = new AwsService();

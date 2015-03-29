/**
 * Module dependencies.
 */

var q = require('q');
var AWS = require('aws-sdk');
var config = require('../../config').aws.sqs;

/**
 * Expose
 */

function SqsManager() {
    //static helpers
    this.QUEUES = {
        INSTAGRAM: 'instagram',
        PRINT: 'print'
    };

    this.sqs = new AWS.SQS();
}

SqsManager.prototype.createMessage = function (queueId, message, options) {
    var deferred = q.defer();

    options = options || {};

    options.MessageBody = message;
    options.QueueUrl = options.QueueUrl || getQueueUrl(queueId);
    options.DelaySeconds = options.DelaySeconds || 0;

    this.sqs.sendMessage(options, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
};

SqsManager.prototype.getMessage = function (queueId, options) {
    var deferred = q.defer();

    options = options || {};

    options.QueueUrl = options.QueueUrl || getQueueUrl(queueId);
    options.MaxNumberOfMessages = options.MaxNumberOfMessages || 1;
    options.VisibilityTimeout = options.VisibilityTimeout || 120;
    options.WaitTimeSeconds = options.WaitTimeSeconds || 20;

    this.sqs.receiveMessage(options, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else if (!data.Messages) {
            deferred.reject('No messages in queue');
        } else {
            var messages = [];
            for (var i = 0; i < data.Messages.length; i++) {
                var message = data.Messages[i];
                try {
                    message.Body = JSON.parse(message.Body);
                } catch (e) {
                }
                messages.push(message);
            }
            deferred.resolve(messages);
        }
    });

    return deferred.promise;
};

SqsManager.prototype.deleteMessage = function (queueId, message, options) {
    var deferred = q.defer();

    options = options || {};

    options.QueueUrl = options.QueueUrl || getQueueUrl(queueId);
    options.ReceiptHandle = options.ReceiptHandle || message.ReceiptHandle;

    this.sqs.deleteMessage(options, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
};

function getQueueUrl(queueId) {
    if (config[queueId]) {
        return config[queueId].url;
    }
    throw new Error('No matching queue found for: ' + queueId);
}

module.exports = exports = new SqsManager;

/**
 * Module dependencies.
 */

var q = require('q');
var _ = require('lodash');
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
    options = options || {};

    options.MessageBody = message;
    options.QueueUrl = options.QueueUrl || getQueueUrl(queueId);
    options.DelaySeconds = options.DelaySeconds || 0;

    return q.ninvoke(this.sqs, 'sendMessage', options);
};

SqsManager.prototype.getMessage = function (queueId, options) {
    var deferred = q.defer();

    options = options || {};

    options.QueueUrl = options.QueueUrl || getQueueUrl(queueId);
    options.MaxNumberOfMessages = options.MaxNumberOfMessages || 1;
    options.VisibilityTimeout = options.VisibilityTimeout || 120;
    options.WaitTimeSeconds = options.WaitTimeSeconds || 20;

    q.ninvoke(this.sqs, 'receiveMessage', options).
    then(function (data) {
        if (!data.Messages) {
            deferred.reject('No messages in queue');
        } else {
            deferred.resolve(parseMessagesBody(data.Messages));
        }
    }).fail(function (err) {
        deferred.reject(err);
    }).done();

    return deferred.promise;
};

SqsManager.prototype.deleteMessage = function (queueId, message, options) {
    options = options || {};

    options.QueueUrl = options.QueueUrl || getQueueUrl(queueId);
    options.ReceiptHandle = options.ReceiptHandle || message.ReceiptHandle;

    return q.ninvoke(this.sqs, 'deleteMessage', options);
};

function parseMessagesBody(messages) {
    var parsedMessages = [];
    _.forEach(messages, function (message) {
        try {
            message.Body = JSON.parse(message.Body);
        } catch (e) {
        }
        parsedMessages.push(message);
    });

    return parsedMessages;
}

function getQueueUrl(queueId) {
    if (config[queueId]) {
        return config[queueId].url;
    }
    throw new Error('No matching queue found for: ' + queueId);
}

module.exports = exports = new SqsManager;

/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var _ = require('lodash');
var mandrill = require('mandrill-api/mandrill');
var config = require('../../config').mandrill;

/**
 * A manager that provides an api to common user functionality.
 *
 * @constructor
 */
function EmailManager() {
    this.mail = new mandrill.Mandrill(config.key);
}

/**
 * Find a single User.
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
EmailManager.prototype.send = function(to, from, subject, messageBody) {
    var deferred = q.defer();

    var message = {
        html: messageBody,
        text: messageBody,
        subject: subject,
        'from_email': from,
        to: formatToEmails(to)
    };

    this.mail.messages.send({
            message: message,
            async: true
        },
        function(result) {
            deferred.resolve(result);
        },
        function(e) {
            console.log(e);
            deferred.reject('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });

    return deferred.promise;
};

function formatToEmails(emails) {
    var formattedEmails = [];
    if (_.isArray(emails)) {
        _.forEach(emails, function(email) {
            formattedEmails.push(formatToEmail(email));
        });
    } else {
        formattedEmails.push(formatToEmail(emails));
    }

    return formattedEmails;
}

function formatToEmail(email) {
    var formattedEmail = {
        type: 'to'
    };

    if (_.isString(email)) {
        formattedEmail.email = email;
    } else {
        if (!!email.name) {
            formattedEmail.name = email.name;
        }

        if (!!email.address) {
            formattedEmail.email = email.address;
        }
    }

    return formattedEmail;
}

/**
 * Expose
 * @type {EmailManager}
 */
module.exports = exports = new EmailManager();

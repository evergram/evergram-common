/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var q = require('q');
var _ = require('lodash');
var common = require('../lib/');
var logger = common.utils.logger;
var userManager = common.user.manager;
var stripe = require('stripe');

//init db
common.db.connect();

var stripeInstance = stripe("sk_test_KN8z6UJtLbBWITp7FZUGiWKI");

var options = {
    criteria: {
        active: true,
        signupComplete: true,
        email: {
            $exists: true,
            $ne: ''
        },
        "billing.stripeId": {
            $exists: true,
            $ne: ''
        }
    }
};

common.db.connect().
then(function() {
    return userManager.findAll(options);
}).
then(function(users) {
    var promises = [];
    var i = 1;
    var numCompleted = 1;
    var total = users.length;

    _.forEach(users, function(user) {
        logger.info('------------------------ STARTING USER ' + user.instagram.username + ', ' + i + ' of ' + total);
        var promise = q.defer();
        promises.push(promise.promise);

        // update stripe user metadata
        updateCustomer(user.billing.stripeId, {
            metadata: {
                first_name: user.firstName,
                instagram_id: user.instagram.id,
                instagram_username: user.instagram.username,
                last_name: user.lastName,
                pixy_customer_id: user._id.toString()
            }
        }).
        then(function() {
            logger.info('Updated user in Stripe');
            logger.info(
                '------------------------ COMPLETED USER ' + user.instagram.username + ', ' + numCompleted + ' of ' + total);
            numCompleted++;
            promise.resolve();
        }).
        fail(function(err) {
            logger.info(
                '------------------------ FAILED USER ' + user.instagram.username + ', ' + numCompleted + ' of ' + total);
            logger.error(err);
            promise.resolve();
        });

        i++;
    });

    return q.all(promises);
}).
then(function() {
    logger.info('WE ARE DONE!');
    logger.info('Waiting 10s before closing...');

    // wait 10s before closing
    setTimeout(function() {
        process.exit(0);
    }, 10000);
});

/**
 * Updates an existing customer in stripe.
 *
 * @param id is the stripe customer id.
 * @param data is the customer data to be updated.
 * @returns {promise|*|q.promise}
 */
function updateCustomer(id, data) {
    logger.info('updateCustomer + ' + id + ', data=' + data);
    return q.ninvoke(stripeInstance.customers, 'update', id, data);
}

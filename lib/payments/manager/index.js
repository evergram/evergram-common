/**
 * PaymentManager
 * @author Richard O'Brien <richard@stichmade.com>
 */

var q = require('q');
var config = require('../../config').stripe;
var logger = require('../../utils').logger;
var Payment = require('../../models').Payment;
var stripe = require('stripe');

/**
 * A manager which provides a simple api to interact with Stripe
 *
 * @constructor
 */
function PaymentManager() {
    this.stripe = stripe(config.secretAccessKey);
}

/**
 * Finds an instagram user from the passed id.
 *
 * @param user
 * @param token: unique one-time token to pass to stripe
 * @returns {promise|*|q.promise}
 */
PaymentManager.prototype.createCustomer = function(user, token) {
    var stripeObject;

    if (token) {
        // Credit card data to associate with account (e.g. regular customer)
        stripeObject = {
            source: token,
            email: user.email,
            plan: user.billing.option,
            metadata: {
                instagram_id: user.instagram.id,
                first_name: user.firstName,
                last_name: user.lastName,
                instagram_username: user.instagram.username
            }
        };
    } else {
        // no credit card data to associate with account (e.g. Gift Card)
        stripeObject = {
            email: user.email,
            plan: user.billing.option,
            metadata: {
                instagram_id: user.instagram.id,
                first_name: user.firstName,
                last_name: user.lastName,
                instagram_username: user.instagram.username
            }
        };
    }

    return q.ninvoke(this.stripe.customers, 'create', stripeObject);
};

/**
 * Expose
 * @type {UserManager}
 */
module.exports = exports = new PaymentManager();
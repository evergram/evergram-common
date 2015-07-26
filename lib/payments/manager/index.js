/**
 * PaymentManager
 * @author Richard O'Brien <richard@stichmade.com>
 */

var q = require('q');
var config = require('../../config').stripe;
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
 * Creates a customer in stripe.
 *
 * @param customerData
 * @returns {promise|*|q.promise}
 */
PaymentManager.prototype.createCustomer = function(customerData) {
    return q.ninvoke(this.stripe.customers, 'create', customerData);
};

/**
 * Expose
 * @type {UserManager}
 */
module.exports = exports = new PaymentManager();

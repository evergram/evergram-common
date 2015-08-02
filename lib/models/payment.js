/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

function Payment() {
    /**
     * Payment Schema
     */
    var PaymentSchema = new Schema({
        amount: {
            type: Number,
            default: 0
        },
        isComplete: {type: Boolean}
    });

    return mongoose.model('Payment', PaymentSchema);
}

module.exports = exports = new Payment();

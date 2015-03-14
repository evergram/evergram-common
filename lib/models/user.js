/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Payment = require('./payment');

var Schema = mongoose.Schema;

function User() {
    /**
     * User Schema
     */

    var UserSchema = new Schema({
        name: {type: String, default: ''},
        email: {type: String, default: ''},
        address: {
            line1: {type: String, default: ''},
            line2: {type: String, default: ''},
            suburb: {type: String, default: ''},
            postcode: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        provider: {type: String, default: ''},
        authToken: {type: String, default: ''},
        billingOption: {type: String, default: ''},
        createdOn: {type: Date},
        updatedOn: {type: Date},
        lastBilledOn: {type: Date},
        nextBilledOn: {type: Date},
        payments: [Payment],
        instagram: {}
    });

    /**
     * Statics
     */

    UserSchema.statics = {
        /**
         * Load
         *
         * @param {Object} options
         * @param {Function} cb
         * @api private
         */

        load: function (options, cb) {
            options.select = options.select || 'name username';
            this.findOne(options.criteria)
            .select(options.select)
            .exec(cb);
        }
    };

    return mongoose.model('User', UserSchema);
}

module.exports = exports = new User;

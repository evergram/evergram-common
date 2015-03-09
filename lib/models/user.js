/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var oAuthTypes = [
    'instragram'
];


function User() {
    /**
     * User Schema
     */

    var UserSchema = new Schema({
        name: {type: String, default: ''},
        email: {type: String, default: ''},
        username: {type: String, default: ''},
        provider: {type: String, default: ''},
        authToken: {type: String, default: ''},
        instagram: {}
    });

    UserSchema.methods.getInstagramId = function (cb) {
        var instagram = this.model('User').instagram;
        if (!!instagram.data) {
            return instagram.data.id;
        }
        return null;
    };

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

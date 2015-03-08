/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


function Image() {
    /**
     * User Schema
     */

    var ImageSchema = new Schema({
        date: {type: Date},
        user: {type: Number, ref: 'User'},
        src: {
            raw: {type: String},
            print: {type: String}
        },
        metadata: {}
    });

    /**
     * Statics
     */

    ImageSchema.statics = {
        /**
         * Load
         *
         * @param {Object} options
         * @param {Function} cb
         * @api private
         */

        load: function (options, cb) {
            options.select = options.select || 'name username';
            this.find(options.criteria)
            .select(options.select)
            .populate('user')
            .exec(cb);
        }
    };

    return mongoose.model('Image', ImageSchema);
}

module.exports = exports = new Image;

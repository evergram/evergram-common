/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Image sub document
 *
 * @returns {Schema}
 * @constructor
 */
function Image() {
    /**
     * User Schema
     */

    var ImageSchema = new Schema({
        _id: String,
        date: {type: Date},
        src: {
            raw: {type: String},
            print: {type: String}
        }
    });

    return ImageSchema;
}

module.exports = exports = new Image;

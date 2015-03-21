/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Image = require('./image');

/**
 * A printable image set
 *
 * @returns {Schema}
 * @constructor
 */
function PrintableImageSet() {
    /**
     * Printable Image Set Schema
     */
    var PrintableImageSetSchema = new Schema({
        date: {type: Date, default: new Date()},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        instagram: [
            Image.Schema
        ],
        printedOn: {type: Date},
        isPrinted: {type: Boolean, default: false}
    });

    PrintableImageSetSchema.index({'isPrinted': 1});
    PrintableImageSetSchema.index({'user': 1});

    return mongoose.model('PrintableImageSet', PrintableImageSetSchema);
}

module.exports = exports = new PrintableImageSet;

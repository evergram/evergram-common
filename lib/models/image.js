/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

function Image() {
    /**
     * User Schema
     */

    var ImageSchema = new Schema({
        _id: String,
        owner: {type: String},
        isOwner: {type: Boolean},
        createdOn: {type: Date},
        taggedOn: {type: Date},
        tag: {type: String},
        action: {type: String},
        user: {
            type: Number,
            ref: 'User'
        },
        src: {
            raw: {type: String},
            print: {type: String}
        },
        metadata: {},
        canPrint: {
            type: Boolean,
            defaut: true
        },
        isPrinted: {
            type: Boolean,
            defaut: false
        }
    });

    return ImageSchema;
}

module.exports = exports = new Image();

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
        date: {type: Date},
        createdOn: {type: Date},
        user: {type: Number, ref: 'User'},
        src: {
            raw: {type: String},
            print: {type: String}
        },
        metadata: {},
        canPrint: {type: Boolean, defaut: true},
        isPrinted: {type: Boolean, defaut: false}
    });

    ImageSchema.index({'canPrint': 1, 'isPrinted': 1});

    return mongoose.model('Image', ImageSchema);
}

module.exports = exports = new Image;

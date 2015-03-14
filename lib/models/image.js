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
        date: {type: Date},
        user: {type: Number, ref: 'User'},
        src: {
            raw: {type: String},
            print: {type: String}
        },
        metadata: {}
    });

    return mongoose.model('Image', ImageSchema);
}

module.exports = exports = new Image;

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
        date: {type: Date},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        instagram: [
            Image.Schema
        ],
        printedOn: {type: Date},
        isPrinted: {type: Boolean, default: false}
    });

    /**
     * Add images to a particular service.
     *
     * @param service
     * @param images
     */
    PrintableImageSetSchema.methods.addImages = function (service, images) {
        for (var i in images) {
            this.addImage(service, images[i]);
        }
    };

    /**
     * Add an image to a particular service
     *
     * @param service
     * @param image
     */
    PrintableImageSetSchema.methods.addImage = function (service, image) {
        if (!!this[service]) {
            if (!this.containsImage(service, image)) {
                this[service].push(image);
            }
        }
    };

    /**
     * Checks a service for the passed image.
     *
     * @param service
     * @param image
     * @returns {boolean}
     */
    PrintableImageSetSchema.methods.containsImage = function (service, image) {
        if (!!this[service]) {
            for (var i in this[service]) {
                if (image._id == this[service][i]._id) {
                    return true;
                }
            }
        }
        return false;
    };

    PrintableImageSetSchema.index({'isPrinted': 1});
    PrintableImageSetSchema.index({'user': 1});

    return mongoose.model('PrintableImageSet', PrintableImageSetSchema);
}

module.exports = exports = new PrintableImageSet;

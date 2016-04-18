/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
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
        startDate: {type: Date},
        endDate: {type: Date},
        period: {
            type: Number,
            default: 0
        },
        user: {
            _id: {type: String},
            instagram: {},
            facebook: {},
            billing: {},
            address: {},
            email: {type: String},
            firstName: {type: String},
            lastName: {type: String}
        },
        images: {
            instagram: [
                Image.Schema
            ],
            facebook: [
                Image.Schema
            ]
        },
        zipFile: {type: String},
        printedOn: {type: Date},
        isReadyForPrint: {
            type: Boolean,
            default: false
        },
        isPrinted: {
            type: Boolean,
            default: false
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        inQueue: {
            type: Boolean,
            default: false
        }
    });

    /**
     * Add images to a particular service.
     *
     * @param service
     * @param images
     */
    PrintableImageSetSchema.methods.addImages = function(service, images) {
        _.forEach(images, (function(image) {
            this.addImage(service, image);
        }).bind(this));
    };

    /**
     * Add an image to a particular service
     *
     * @param service
     * @param image
     */
    PrintableImageSetSchema.methods.addImage = function(service, image) {
        if (!!this.images[service]) {
            if (!this.containsImage(service, image)) {
                this.images[service].push(image);
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
    PrintableImageSetSchema.methods.containsImage = function(service, image) {
        var containsImage = false;
        if (!!this.images[service]) {
            if (service === 'instagram') {
                _.forEach(this.images[service], function(img) {
                    if (image._id === img._id) {
                        containsImage = true;
                        return;
                    }
                });
            } else {
                // facebook
                _.forEach(this.images[service], function(img) {
                    if (image.src.raw === img.src.raw) {
                        containsImage = true;
                        return;
                    }
                });
            }
        }

        return containsImage;
    };

    /**
     * Iterates through the image services and gets the number of total images.
     *
     * @returns {number}
     */
    PrintableImageSetSchema.methods.getNumberOfImages = function() {
        var numberOfImages = 0;
        _.forEach(this.images, function(images) {
            numberOfImages += images.length;
        });

        return numberOfImages;
    };

    PrintableImageSetSchema.index({isPrinted: 1});
    PrintableImageSetSchema.index({user: 1});

    return mongoose.model('PrintableImageSet', PrintableImageSetSchema);
}

module.exports = exports = new PrintableImageSet();

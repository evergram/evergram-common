/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Image = require('./image');
var config = require('../config');

/**
 * A printable image set
 *
 * @returns {Schema}
 * @constructor
 */
function PrintableImageSet() {
    var IMAGE_SERVICE_INSTAGRAM = 'instagram';
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
            billing: {},
            address: {},
            email: {type: String},
            firstName: {type: String},
            lastName: {type: String},
            active: {
                type: Boolean,
                default: true
            },
            signupComplete: {
                type: Boolean,
                default: true
            }
        },
        images: {
            instagram: [
                Image.schema
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
        },
        createdOn: {type: Date},
        updatedOn: {type: Date},
        lastRunOn: {type: Date},
        nextRunOn: {type: Date},
        inQueueOn: {type: Date}
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
            _.forEach(this.images[service], function(img) {
                if (image._id === img._id) {
                    containsImage = true;
                    return;
                }
            });
        }

        return containsImage;
    };

    /**
     * Iterates through the image services and gets the number of total images.
     *
     * @returns {number}
     */
    PrintableImageSetSchema.methods.getNumberOfImages = function() {
        // instagram only at the moment
        return this.images[IMAGE_SERVICE_INSTAGRAM].length;
    };

    /**
     * Gets the instagram set of images.
     *
     * @returns {Array}
     */
    PrintableImageSetSchema.methods.getInstagramImages = function() {
        return this.images[IMAGE_SERVICE_INSTAGRAM];
    };

    /**
     * Tests if the current image set is a limit based image set.
     *
     * @returns {boolean}
     */
    PrintableImageSetSchema.methods.isLimitPlan = function() {
        return new RegExp(config.plans.simpleLimit).test(this.user.billing.option.toUpperCase());
    };

    /**
     * Gets the current limit of based on the plan name.
     *
     * @returns {Number}
     */
    PrintableImageSetSchema.methods.getLimit = function() {
        var limit = 0;
        var matches = this.user.billing.option.toUpperCase().match(
            new RegExp(config.plans.simpleLimit)
        );

        if (!!matches && !!matches[1]) {
            limit = parseInt(matches[1], 10);

            if (isNaN(limit)) {
                limit = 0;
            }
        }

        return limit;
    };

    /**
     * Determines if the image set is currently at the limit.
     *
     * @returns {boolean}
     */
    PrintableImageSetSchema.methods.isLimited = function() {
        return this.images[IMAGE_SERVICE_INSTAGRAM].length >= this.getLimit();
    };

    PrintableImageSetSchema.index({isPrinted: 1});
    PrintableImageSetSchema.index({user: 1});

    return mongoose.model('PrintableImageSet', PrintableImageSetSchema);
}

module.exports = exports = new PrintableImageSet();

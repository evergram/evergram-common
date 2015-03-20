/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var Q = require('q');
var PrintableImageSet = require('../../models').PrintableImageSet;

/**
 *
 * @param user
 * @constructor
 */
function PrintManager(user) {

}

/**
 *
 * @param userId
 * @returns {promise|*|Q.promise}
 */
PrintManager.prototype.findByUser = function (user) {
    var deferred = Q.defer();

    PrintableImageSet.findOne({user: user})
    .exec(function (err, imageSet) {
        deferred.resolve(imageSet);
    });

    return deferred.promise;
};

/**
 *
 * @param userId
 * @returns {promise|*|Q.promise}
 */
PrintManager.prototype.save = function (printableImageSet) {
    var deferred = Q.defer();

    printableImageSet.save(function () {
        deferred.resolve();
    });

    return deferred.promise;
};

/**
 *
 * @param imageSet
 * @param images
 */
PrintManager.prototype.addImagesToSet = function (imageSet, images) {
    for (var i in images) {
        if (!this.containsImage(imageSet, images[i])) {
            imageSet.push(images[i]);
        }
    }
};

/**
 *
 * @param imageSet
 * @param images
 */
PrintManager.prototype.containsImage = function (images, image) {
    for (var i in images) {
        if (image._id == images[i]._id) {
            return true;
        }
    }
    return false;
};

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new PrintManager;

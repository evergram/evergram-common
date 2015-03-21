/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var Q = require('q');
var PrintableImageSet = require('../../models').PrintableImageSet;
var moment = require('moment');

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
PrintManager.prototype.findAllByUser = function (user) {
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
PrintManager.prototype.findCurrentByUser = function (user) {
    var deferred = Q.defer();

    var criteria = {
        user: user,
        date: user.getCurrentPeriodStartDate()
    };

    PrintableImageSet.findOne(criteria)
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

    printableImageSet.save(function (err, printableImageSet) {
        if (!err) {
            deferred.resolve(printableImageSet);
        } else {
            deferred.reject(err);
        }
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
 *
 * @param user
 * @returns {PrintableImageSet}
 */
PrintManager.prototype.getNewPrintableImageSet = function (user) {
    var printableImageSet = new PrintableImageSet();
    printableImageSet.user = user;
    printableImageSet.date = user.getCurrentPeriodStartDate();
    return printableImageSet;
};

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new PrintManager;

/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
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
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.find = function (options) {
    var deferred = q.defer();

    var query = PrintableImageSet.findOne(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    query.exec(function (err, imageSet) {
        deferred.resolve(imageSet);
    });

    return deferred.promise;
};

/**
 * Gets the all PrintableImageSet's for the user
 *
 * @param userId
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findAllByUser = function (user) {
    var deferred = q.defer();

    PrintableImageSet.find({user: user})
    .exec(function (err, imageSets) {
        deferred.resolve(imageSets);
    });

    return deferred.promise;
};

/**
 * Gets the current PrintableImageSet for the user if it exists
 *
 * @param userId
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findCurrentByUser = function (user) {
    var deferred = q.defer();

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
 * Gets the previous PrintableImageSet for the user
 *
 * @param userId
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findPreviousByUser = function (user) {
    var deferred = q.defer();

    var criteria = {
        user: user,
        date: user.getPreviousPeriodStartDate(1)
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
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.save = function (printableImageSet) {
    var deferred = q.defer();

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

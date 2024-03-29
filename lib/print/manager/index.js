/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var logger = require('../../utils').logger;
var PrintableImageSet = require('../../models').PrintableImageSet;

/**
 *
 * @param user
 * @constructor
 */
function PrintManager() {

}

/**
 *
 * @param userId
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.find = function(options) {
    if (!options) {
        options = {};
    }

    var query = PrintableImageSet.findOne(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    return q.ninvoke(query, 'exec');
};

/**
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findAll = function(options) {
    if (!options) {
        options = {};
    }

    var query = PrintableImageSet.find(options.criteria);

    if (!!options.select) {
        query.select(options.select);
    }

    return q.ninvoke(query, 'exec');
};

/**
 * Gets the all PrintableImageSet's for the user
 *
 * @param userId
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findAllByUser = function(user) {
    return this.findAll({
        criteria: {
            'user._id': user._id.toString()
        }
    });
};

/**
 * Gets the current PrintableImageSet for the user if it exists
 *
 * @param userId
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findCurrentByUser = function(user) {
    return this.find({
        criteria: {
            'user._id': user._id.toString(),
            startDate: user.getCurrentPeriodStartDate()
        }
    });
};

/**
 * Find all image sets that are marked as ready for print.
 *
 * @param user
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findAllReadyForPrintByUser = function(user) {
    return this.findAll({
        criteria: {
            'user._id': user._id.toString(),
            isReadyForPrint: true,
            isPrinted: false
        }
    });
};

/**
 * Find all images sets that have been marked as printed.
 *
 * @param user
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findAllPrintedByUser = function(user) {
    return this.findAll({
        criteria: {
            'user._id': user._id.toString(),
            isReadyForPrint: true,
            isPrinted: true
        }
    });
};

/**
 * Find the previous PrintableImageSet for the user.
 *
 * @param user
 * @param period
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findPreviousByUser = function(user, period) {
    if (!period) {
        period = 1;
    }

    return this.find({
        criteria: {
            'user._id': user._id.toString(),
            startDate: user.getPreviousPeriodStartDate(period)
        }
    });
};

/**
 * Get all previous image sets that have not yet been marked as ready for print, or printed.
 *
 * @param user
 * @param period
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.findAllPreviousNotReadyForPrintByUser = function(user) {
    return this.findAll({
        criteria: {
            'user._id': user._id.toString(),
            startDate: {
                $lt: user.getCurrentPeriodStartDate()
            },
            isReadyForPrint: false,
            isPrinted: false
        }
    });
};

/**
 *
 * @param userId
 * @returns {promise|*|q.promise}
 */
PrintManager.prototype.save = function(printableImageSet) {
    return q.ninvoke(printableImageSet, 'save').then(function() {
        logger.info('Image Set ' + printableImageSet._id + ' successfully saved.');
        return printableImageSet;
    });
};

/**
 *
 * @param user
 * @returns {PrintableImageSet}
 */
PrintManager.prototype.getNewPrintableImageSet = function(user, period) {
    if (!period && period !== 0) {
        period = user.getCurrentPeriod();
    }

    var printableImageSet = new PrintableImageSet();
    printableImageSet.user = user;
    printableImageSet.startDate = user.getPeriodStartDate(period);
    printableImageSet.endDate = user.getPeriodEndDate(period);
    printableImageSet.period = period;
    return printableImageSet;
};

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new PrintManager();

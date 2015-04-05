/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A tracking service that contains a manager
 *
 * @constructor
 */
function TrackingService() {
    this.manager = require('./manager');
}

/**
 * Expose
 * @type {TrackingService}
 */
module.exports = exports = new TrackingService;
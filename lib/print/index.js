/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A service that handles printing aspects of evergram
 *
 * @constructor
 */
function PrintService() {
    this.manager = require('./manager');
}

/**
 *
 * @type {PrintService}
 */
module.exports = exports = new PrintService();
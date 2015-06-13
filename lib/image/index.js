/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A service that handles images
 *
 * @constructor
 */
function ImageService() {
    this.manager = require('./manager');
}

/**
 *
 * @type {ImageService}
 */
module.exports = exports = new ImageService();

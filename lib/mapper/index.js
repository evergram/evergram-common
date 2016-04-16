/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A mapper
 *
 * @constructor
 */
function Mapper() {
    this.instagramImage = require('./instagramImage');
    this.instagramUser = require('./instagramUser');
    this.facebookUser = require('./facebookUser');
}

/**
 * Expose
 * @type {Mapper}
 */
module.exports = exports = new Mapper();

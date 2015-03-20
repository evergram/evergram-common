/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

function Models() {
    this.User = require('./user');
    this.Image = require('./image');
    this.PrintableImageSet = require('./printableImageSet');
}

module.exports = exports = new Models;
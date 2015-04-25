/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

function Models() {
    this.Image = require('./image');
    this.Payment = require('./payment');
    this.PrintableImageSet = require('./printableImageSet');
    this.User = require('./user');
}

module.exports = exports = new Models();
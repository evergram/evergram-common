/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

function Models() {
    this.User = require('./user');
    this.Image = require('./image');
}

module.exports = exports = new Models;
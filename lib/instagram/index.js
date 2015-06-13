/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

function InstagramService() {
    this.config = require('../config').instagram;
    this.manager = require('./manager');
}

module.exports = exports = new InstagramService();

/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A common service that provides access to config, AWS, database, models, instagram, user and utils.
 * @constructor
 */
function Common() {
    this.config = require('./config');
    this.aws = require('./aws');
    this.db = require('./db');
    this.models = require('./models');
    this.instagram = require('./instagram');
    this.user = require('./user');
    this.utils = require('./utils');
}

/**
 * Expose
 * @type {Common}
 */
module.exports = exports = new Common;


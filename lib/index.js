/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A common service that provides access to config, AWS, database, models, instagram, user, payments and utils.
 * @constructor
 */
function Common() {
    this.config = require('./config');
    this.aws = require('./aws');
    this.db = require('./db');
    this.email = require('./email');
    this.image = require('./image');
    this.instagram = require('./instagram');
    this.mapper = require('./mapper');
    this.models = require('./models');
    this.print = require('./print');
    this.tracking = require('./tracking');
    this.user = require('./user');
    this.utils = require('./utils');
}

/**
 * Expose
 * @type {Common}
 */
module.exports = exports = new Common();

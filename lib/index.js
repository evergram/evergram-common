/**
 * Module dependencies
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

var Common = new Common;


module.exports = exports = Common;


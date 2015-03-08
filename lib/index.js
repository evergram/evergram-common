/**
 * Module dependencies
 */

function Common() {
    this.config = require('./config');
    this.db = require('./db');
    this.models = require('./models');
    this.instagram = require('./instagram');
    this.utils = require('./utils');
}

var Common = new Common;


module.exports = exports = Common;


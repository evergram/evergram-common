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

module.exports = exports = new Common();
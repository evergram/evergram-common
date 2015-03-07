/**
 * Module dependencies
 */

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/config');
var utils = require('./lib/utils');

var app = express();

// Connect to mongodb
var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
    if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// Bootstrap application settings
require('./config/express')(app, passport);

/**
 * Expose
 */

module.exports = {
    app: app,
    config: config,
    utils: utils
};

/**
 * Module dependencies
 */

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/config');
var utils = require('./lib/utils');

var initApp = true;
var initModels = true;
var initMongoose = true;
var app = express();


if (initMongoose) {
    // Connect to mongodb
    var connect = function () {
        var options = {server: {socketOptions: {keepAlive: 1}}};
        mongoose.connect(config.db, options);
    };
    connect();

    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', connect);
    initMongoose = false;
}

if (initModels) {
    // Bootstrap models
    fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
        if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
    });
    initModels = false;
}

if (initApp) {
    // Bootstrap application settings
    require('./config/express')(app, passport);
    initApp = false;
}

/**
 * Expose
 */

module.exports = {
    app: app,
    db: mongoose,
    config: config,
    models: {
        user: mongoose.model('User')
    },
    utils: utils
};

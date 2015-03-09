/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var config = require('../config');

function Db() {
}

/**
 * Instantiate the database connection
 */
Db.prototype.connect = function () {
    // Connect to mongodb
    var connect = function () {
        var options = {server: {socketOptions: {keepAlive: 1}}};
        mongoose.connect(config.db, options);
    };
    connect();

    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', connect);
};

module.exports = new Db;
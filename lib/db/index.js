/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../utils').logger;

function Db() {
}

/**
 * Instantiate the database connection
 */
Db.prototype.connect = function() {
    // Connect to mongodb
    var connect = function() {
        var options = {server: {socketOptions: {keepAlive: 1}}};
        mongoose.connect(config.db, options);
    };
    connect();

    mongoose.connection.on('error', logger.error);
    mongoose.connection.on('disconnected', connect);
};

/**
 * Expose
 * @type {Db}
 */
module.exports = new Db();
/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../utils').logger;

function Db(options) {
    options = options || {};
    this.autoReconnect = options.autoReconnect || false;
}

/**
 * Instantiate the database connection
 */
Db.prototype.connect = function() {
    var deferred = q.defer();

    if (!this._db || this._db.readyState !== mongoose.Connection.STATES.connected) {
        // Connect to mongodb
        var connect = function() {
            var options = {server: {socketOptions: {keepAlive: 1}}};
            mongoose.connect(config.db, options);
        };

        connect();

        this._db = mongoose.connection;

        this._db.on('error', logger.error);
        this._db.on('disconnected', function() {
            if (this.autoReconnect) {
                connect();
            }
        }.bind(this));

        this._db.on('connected', function() {
            logger.info('Connection opened');
            deferred.resolve();
        });
    } else {
        // the db is still connected, so just resolve
        deferred.resolve();
    }

    return deferred.promise;
};

/**
 * Expose
 * @type {Db}
 */
module.exports = new Db();

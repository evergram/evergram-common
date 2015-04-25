/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var development = require('./env/development');
var test = require('./env/test');
var production = require('./env/production');

/**
 * Config
 *
 * @returns {*}
 * @constructor
 */
function Config() {
    return {
        development: development,
        test: test,
        production: production
    }[process.env.NODE_ENV || 'development'];
}

/**
 * Expose
 */
module.exports = exports = new Config();

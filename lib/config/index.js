/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * Config
 *
 * @returns {*}
 * @constructor
 */
function Config() {
    return {
        development: require('./env/development'),
        test: require('./env/test'),
        production: require('./env/production')
    }[process.env.NODE_ENV || 'development'];
}

/**
 * Expose
 */
module.exports = exports = new Config();

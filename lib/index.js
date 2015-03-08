/**
 * Module dependencies
 */

function Common() {
    return {
        express: require('./express'),
        db: require('./db'),
        config: require('./config'),
        models: require('./models'),
        utils: require('./utils')
    };
}

module.exports = exports = new Common();
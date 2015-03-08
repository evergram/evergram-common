/**
 * Module dependencies
 */

function Common() {
    return {
        db: require('_/db'),
        config: require('_/config'),
        models: require('_/models'),
        utils: require('_/utils')
    };
}

module.exports = exports = new Common();
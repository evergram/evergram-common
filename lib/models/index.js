/**
 * Module dependencies
 */

function Models() {
    return {
        User: require('./user')
    }
}

module.exports = exports = new Models();
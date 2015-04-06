/**
 * Module dependencies
 */

var common = require('./lib/');
var user = common.models.User;
var logger = common.utils.logger;
var userManager = common.user.manager;
var trackingManager = common.tracking.manager;

//init db
common.db.connect();

var id = '5520bafafaa4723e80bddced';
var criteria = {_id: id};

userManager.find({criteria: criteria}).then(function (user) {
    trackingManager.createUser(user).then(function (r) {
        trackingManager.trackEvent(user, 'Tagged Instagram Photos', {
            'Username': user.getUsername(),
            'Total Photos': 10,
            'Total Own Photos': 2,
            'Total Other Photos': 8
        }).then(function () {
            logger.info('Done')
        });
    });
});
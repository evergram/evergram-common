/**
 * Module dependencies
 */

var _ = require('lodash');
var common = require('./lib/');
var User = common.models.User;
var logger = common.utils.logger;
var userManager = common.user.manager;
var trackingManager = common.tracking.manager;

//init db
common.db.connect();
//
//var id = '5520bafafaa4723e80bddced';
//var criteria = {_id: id};
//
////backfill
//
//userManager.findAll().then(function (users) {
//    _.forEach(users, function (user) {
//        trackingManager.createUser(user).then(function (r) {
//            logger.info(user.getUsername());
//        });
//    });
//});


userManager.find({criteria: {'instagram.username': 'emteds'}}).then(function (user) {
    user.jobs.instagram.inQueue = true;

    userManager.update(user);
});

var newUser = new User();
newUser.firstName = 'Test';
newUser.instagram = {
    username: 'test'
};
userManager.create(newUser);
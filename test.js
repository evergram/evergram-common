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

var id = '553208b7a1f2d86b0206639b';
var options = {criteria: {_id: id}};
//var options = {};

//backfill
userManager.findAll(options).then(function (users) {
    _.forEach(users, function (user) {
        logger.info('Start', user.getUsername());
        trackingManager.createUser(user).
        then(function (r) {
            return trackingManager.trackEvent(user, 'Test', {stuff: 'yeah stuff'}, new Date());
        }).
        then(function (r) {
            logger.info('Done', user.getUsername());
        }).
        fail(function (err) {
            logger.error(err);
        }).done();
    });
}).fail(function (err) {
    logger.error(err);
}).done();


//userManager.find({criteria: {'instagram.username': 'emteds'}}).then(function (user) {
//    user.jobs.instagram.inQueue = true;
//
//    userManager.update(user);
//});
//
//var newUser = new User();
//newUser.firstName = 'Test';
//newUser.instagram = {
//    username: 'test'
//};
//userManager.create(newUser);
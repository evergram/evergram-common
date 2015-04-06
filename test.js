/**
 * Module dependencies
 */

var _ = require('lodash');
var common = require('./lib/');
var user = common.models.User;
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
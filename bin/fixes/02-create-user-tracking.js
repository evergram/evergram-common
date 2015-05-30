/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var q = require('q');
var _ = require('lodash');
var common = require('../../lib/');
var logger = common.utils.logger;
var userManager = common.user.manager;
var trackingManager = common.tracking.manager;

//init db
common.db.connect();

var options = {
    criteria: {
        'instagram.username': {
            $in: [
                'rackree'
            ]
        },
        active: true
    }
};

//var options = {
//    criteria: {
//        active: true
//    }
//};

//backfill
userManager.findAll(options).then(function(users) {
    var deferreds = [];
    var i = 0;
    var total = users.length;

    _.forEach(users, function(user) {
        logger.info('------------------------ STARTING USER ' + i + ' of ' + total);
        var deferred = q.defer();
        deferreds.push(deferred.promise);

        //create user
        createUser(user).
            then(function() {
                logger.info('Created user in Segment');
            }).
            done(function() {
                logger.info('------------------------ COMPLETED USER ' + i + ' of ' + total);
                deferred.resolve();
            });

        i++;
    });

    return q.all(deferreds).then(function() {
        logger.info('WE ARE DONE!');
    });
});

function createUser(user) {
    return trackingManager.createUser(user);
}
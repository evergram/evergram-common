/**
 * Module dependencies
 */
process.env.TZ = 'UTC';

var q = require('q');
var _ = require('lodash');
var moment = require('moment');
var Type = require('type-of-is');
var common = require('../../lib/');
var logger = common.utils.logger;
var userManager = common.user.manager;

//init db
common.db.connect();

/* address.postcode
 * FROM: Number (39)
 * TO:   String (328)
 * Should have 39 effected records
 */

userManager.findAll({
    criteria : { "address.postcode" : { $type : 1 } }
}).
then(function(users) {

    var deferreds = [];
    var i = 0;

    logger.info('---------- UPDATE address.postcode START');

    _.forEach(users, function(user) {
        

        var postcode = user.address.postcode;
        user.address.postcode = user.address.postcode.toString();
        logger.info(user.instagram.username + ": Before: " + postcode + " => After: " + user.address.postcode);
        logger.info(user.instagram.username + ": address.postcode type changed to " + Type.string(user.address.postcode));
        user.markModified('address.postcode');
        deferreds.push(userManager.update(user));

        i++;
    });

    return q.all(deferreds).then(function() {
        logger.info('---------- UPDATE address.postcode COMPLETED: ' + i + ' user records effected.')
    });
});

/* instagram.id
 * FROM: Number (32)
 * TO:   String (335)
 * Should have 32 effected records
 */

userManager.findAll({
    criteria : { "instagram.id" : { $type : 1 } }
}).
then(function(users) {

    var deferreds = [];
    var i = 0;

    logger.info('---------- UPDATE instagram.id START');

    _.forEach(users, function(user) {

        var before = user.instagram.id;
        user.instagram.id = user.instagram.id.toString();
        logger.info(user.instagram.username + ": Before: " + before + " => After: " + user.instagram.id);
        logger.info(user.instagram.username + ": instagram.id type changed to " + Type.string(user.instagram.id));
        user.markModified('instagram.id');
        deferreds.push(userManager.update(user));

        i++;
    });

    return q.all(deferreds).then(function() {
        logger.info('---------- UPDATE instagram.id COMPLETED: ' + i + ' user records effected.')
    });
});




// DATES

/* createdOn
 * FROM: String (39)
 * TO:   Date (328)
 * Should have 39 effected records
 */

userManager.findAll({
    criteria : { "createdOn" : { $type : 2 } }
}).
then(function(users) {

    var deferreds = [];
    var i = 0;

    logger.info('---------- UPDATE createdOn START');

    _.forEach(users, function(user) {

        var before = user.createdOn;
        user.createdOn = toDate(user.createdOn);
        logger.info(user.instagram.username + ": Before: " + before + " => After: " + user.createdOn);
        logger.info(user.instagram.username + ": createdOn type changed to " + Type.string(user.createdOn));
        user.markModified('createdOn');
        deferreds.push(userManager.update(user));
        
        i++;
    });

    return q.all(deferreds).then(function() {
        logger.info('---------- UPDATE createOn COMPLETED: ' + i + ' user records effected.')
    });
});



/* signupCompletedOn
 * FROM: String (15)
 * TO:   Date (288)
 * Should have 15 effected records
 */

userManager.findAll({
    criteria : { "signupCompletedOn" : { $type : 2 } }
}).
then(function(users) {

    var deferreds = [];
    var i = 0;

    logger.info('---------- UPDATE signupCompletedOn START');

    _.forEach(users, function(user) {
        
        var before = user.signupCompletedOn;
        user.signupCompletedOn = toDate(user.signupCompletedOn);
        logger.info(user.instagram.username + ": Before: " + before + " => After: " + user.signupCompletedOn);
        logger.info(user.instagram.username + ": signupCompletedOn type changed to " + Type.string(user.signupCompletedOn));
        user.markModified('signupCompletedOn');
        deferreds.push(userManager.update(user));
        
        i++;
    });

    return q.all(deferreds).then(function() {
        logger.info('---------- UPDATE signupCompletedOn COMPLETED: ' + i + ' user records effected.')
    });
});


function toDate(dateString) {
    return moment(dateString);
}




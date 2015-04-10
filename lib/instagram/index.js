/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var userManager = require('../user').manager;
var userMapper = require('../mapper');
var logger = require('../utils').logger;

function InstagramService() {
    this.config = require('../config').instagram;
    this.manager = require('./manager');
}

/**
 * Instatiate the instagram auth strategy.
 */
InstagramService.prototype.initAuthStrategy = function () {
    var passport = require('passport');

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        userManager.findUser({criteria: {_id: id}}).then(function (user) {
            done(null, user);
        }, function (err) {
            done(err);
        });
    });

    // use these strategies
    passport.use(getInstagramAuthStrategy(this.config));
};

function getInstagramAuthStrategy(config) {
    var InstagramStrategy = require('passport-instagram').Strategy;

    return new InstagramStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL
    }, function (accessToken, refreshToken, profile, done) {
        var options = {
            criteria: {'instagram.id': profile.id}
        };
        
        userManager.findUser(options).then(function (user) {
            if (!user) {
                return userManager.create(userMapper.instagramUser.toModel(profile)).then(function (user) {
                    return done(null, user);
                }, function (err) {
                    logger.error("** USER SIGNUP **: Error creating user account for user (" + profile.username + ")");
                    return done(err);
                });
            } else if (user && user.signupComplete) {
                logger.info("** USER SIGNUP **: User attempted to signup but account already registered (" + profile.username + "). Redirected to " + config.redirect.fail);
                // redirect to "Oops, looks like you've already got an Evergram account" page.
                done(null, false, { "message": "User account already registered." });
            } else {
                // user has started the signup process but never completed it.
                logger.info("** USER SIGNUP **: User " + profile.username + " returned to complete an un-finished signup.");
                done(null, user);
            }
        }, function (err) {
            logger.error("** USER SIGNUP **: getInstagramAuthStrategy(): " + err);
            done(err);
        });
    });
}

module.exports = exports = new InstagramService;
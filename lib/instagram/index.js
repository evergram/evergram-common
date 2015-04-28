/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
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
InstagramService.prototype.initAuthStrategy = function() {
    var passport = require('passport');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        userManager.find({criteria: {_id: id}}).
            then(function(user) {
                done(null, user);
            }).
            fail(function(err) {
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
    }, function(accessToken, refreshToken, profile, done) {
        var options = {
            criteria: {'instagram.id': profile.id}
        };

        userManager.find(options).
            then(function(user) {
                if (!user) {
                    //add the access token to the profile
                    profile.accessToken = accessToken;

                    return userManager.create(userMapper.instagramUser.toModel(profile)).
                        then(function(user) {
                            return done(null, user);
                        }).
                        fail(function(err) {
                            logger.error('Error creating user account for user (' + profile.username + ')');
                            return done(err);
                        });
                } else if (user && user.signupComplete && _.isEmpty(user.instagram.authToken)) {
                    logger.info('User is already registered (' + profile.username +
                    '), but is missing an auth token. Redirected to ' + config.redirect.reauth);

                    user.instagram.authToken = accessToken;
                    userManager.update(user).
                        finally(function() {
                            done(null, user);
                        });
                } else if (user && user.signupComplete && !_.isEmpty(user.instagram.authToken)) {
                    logger.info('User attempted to signup but account already registered (' + profile.username +
                    '). Redirected to ' + config.redirect.fail);

                    // redirect to 'Oops, looks like you've already got an Evergram account' page.
                    done(null, false, {message: 'User account already registered.'});
                } else {
                    // user has started the signup process but never completed it.
                    logger.info('User ' + profile.username + ' returned to complete an un-finished signup.');
                    done(null, user);
                }
            }).
            fail(function(err) {
                logger.error('getInstagramAuthStrategy(): ' + err);
                done(err);
            });
    });
}

module.exports = exports = new InstagramService();
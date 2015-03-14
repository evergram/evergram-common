/**
 * Module dependencies
 */

function InstagramService() {
    this.config = require('../config').instagram;
    this.manager = require('./manager');
}

/**
 * Instatiate the instagram auth strategy.
 */
InstagramService.prototype.initAuthStrategy = function () {
    var User = require('../models').User;
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
    var userManager = require('../user/manager');
    var InstagramStrategy = require('passport-instagram').Strategy;

    return new InstagramStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL
    }, function (accessToken, refreshToken, profile, done) {
        var options = {
            criteria: {'instagram.data.id': profile.id}
        };

        userManager.findUser(options).then(function (user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                userManager.create({
                    name: profile.displayName,
                    username: profile.username,
                    provider: 'instagram',
                    authToken: accessToken,
                    instagram: profile._json
                }).then(function (user) {
                    return done(err, user);
                }, function (err) {
                    console.log(err);
                    return done(err);
                });
            } else {
                return done(err, user);
            }
        });
    });
}

module.exports = exports = new InstagramService;
/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var userManager = require('../user').manager;
var userMapper = require('../mapper');

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
                    return done(err);
                });
            } else {
                done(null, user);
            }
        }, function (err) {
            done(err);
        });
    });
}

module.exports = exports = new InstagramService;
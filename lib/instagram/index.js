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
        done(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        User.load({criteria: {_id: id}}, function (err, user) {
            done(err, user)
        });
    });

    // use these strategies
    passport.use(getInstagramAuthStrategy(this.config));
};

function getInstagramAuthStrategy(config) {
    var User = require('../models').User;
    var InstagramStrategy = require('passport-instagram').Strategy;

    return new InstagramStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL
    }, function (accessToken, refreshToken, profile, done) {
        var options = {
            criteria: {'instagram.data.id': profile.id}
        };
        User.load(options, function (err, user) {
            if (err) return done(err);
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    username: profile.username,
                    provider: 'instagram',
                    instagram: profile._json
                });
                user.save(function (err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
    });
}

module.exports = exports = new InstagramService;
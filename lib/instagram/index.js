/**
 * Module dependencies
 */

function Instagram() {
    this.config = require('../config').instagram;
    this.manager = require('./manager');

    this.init();
}

Instagram.prototype.init = function () {
    var passport = require('passport');

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function (id, done) {
        User.load({criteria: {_id: id}}, function (err, user) {
            done(err, user)
        })
    });

    // use these strategies
    passport.use(this.getInstagramAuthStrategy());
};

Instagram.prototype.getInstagramAuthStrategy = function () {
    var User = require('../models').User;
    var InstagramStrategy = require('passport-instagram').Strategy;

    return new InstagramStrategy({
        clientID: this.config.clientID,
        clientSecret: this.config.clientSecret,
        callbackURL: this.config.callbackURL
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

module.exports = exports = new Instagram();
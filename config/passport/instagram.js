/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var InstagramStrategy = require('passport-instagram').Strategy;
var config = require('config');
var User = mongoose.model('User');

/**
 * Expose
 */

module.exports = new InstagramStrategy({
    clientID: config.instagram.clientID,
    clientSecret: config.instagram.clientSecret,
    callbackURL: config.instagram.callbackURL
},
function (accessToken, refreshToken, profile, done) {
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
}
);

/**
 * Module dependencies.
 */

var session = require('express-session');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var mongoStore = require('connect-mongo')(session);
var config = require('config');
var pkg = require('../package.json');

/**
 * Expose
 */

module.exports = function (app, passport) {
    // Compression middleware (should be placed before express.static)
    app.use(compression({
        threshold: 512
    }));

    // bodyParser should be above methodOverride
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride());

    // CookieParser should be above session
    app.use(cookieParser());
    app.use(cookieSession({secret: 'secret'}));
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: pkg.name,
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
};

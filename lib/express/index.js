/**
 * Module dependencies
 */

function Express() {
    var session = require('express-session');
    var compression = require('compression');
    var cookieParser = require('cookie-parser');
    var cookieSession = require('cookie-session');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var mongoStore = require('connect-mongo')(session);
    var config = require('../config');

    var passport = require('passport');
    var express = require('express')();

    // Compression middleware (should be placed before express.static)
    express.use(compression({
        threshold: 512
    }));

    // bodyParser should be above methodOverride
    express.use(bodyParser.json());
    express.use(bodyParser.urlencoded({extended: true}));
    express.use(methodOverride());

    // CookieParser should be above session
    express.use(cookieParser());
    express.use(cookieSession({secret: 'secret'}));
    express.use(session({
        resave: true,
        saveUninitialized: true,
        secret: 'evergram',
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));

    // use passport session
    express.use(passport.initialize());
    express.use(passport.session());

    return express;
}

module.exports = exports = new Express();
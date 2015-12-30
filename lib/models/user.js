/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var Payment = require('./payment');
var moment = require('moment-timezone');

var Schema = mongoose.Schema;

function User() {
    /**
     * User Schema
     */

    var UserSchema = new Schema({
        firstName: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        address: {
            line1: {
                type: String,
                default: ''
            },
            line2: {
                type: String,
                default: ''
            },
            suburb: {
                type: String,
                default: ''
            },
            state: {
                type: String,
                default: ''
            },
            postcode: {
                type: String,
                default: ''
            },
            country: {
                type: String,
                default: ''
            }
        },
        billing: {
            option: {
                type: String,
                default: ''
            },
            stripeId: {
                type: String,
                default: ''
            }
        },
        createdOn: {type: Date},
        updatedOn: {type: Date},
        payments: [Payment.schema],
        instagram: {
            id: {type: String},
            username: {type: String},
            authToken: {type: String},
            follows: {
                type: Number,
                default: 0
            },
            followers: {
                type: Number,
                default: 0
            },
            media: {
                type: Number,
                default: 0
            },
            profilePicture: {
                type: String,
                default: ''
            },
            website: {
                type: String,
                default: ''
            },
            bio: {
                type: String,
                default: ''
            }
        },
        timezone: {
            type: String,
            default: 'Australia/Melbourne'
        },
        active: {
            type: Boolean,
            default: true
        },
        signupComplete: {
            type: Boolean,
            default: false
        },
        signupCompletedOn: {type: Date}
    });

    /**
     * Set createdOn to today's date (normalised to 12:00am) when new record is created.
     *
     * @returns {*}
     */
    UserSchema.pre('save', function(next) {
        // TODO consider daylight savings and other timezones. eg .isDST() or moment.utc()
        if (!_.isDate(this.createdOn)) {
            this.createdOn = getNow();
        }

        // set the signup completed on date
        if (!_.isDate(this.signupCompletedOn) && this.signupComplete) {
            this.signupCompletedOn = getNow();
        }

        this.updatedOn = getNow();

        next();
    });

    /**
     * Get a unique username
     *
     * @returns {.instagram.username|*}
     */
    UserSchema.methods.getUsername = function() {
        return this.instagram.username;
    };

    /**
     * Determines if the user is still in their first period
     *
     * @returns {*}
     */
    UserSchema.methods.isInFirstPeriod = function() {
        return this.getCurrentPeriod() === 0;
    };

    /**
     * Gets the period number (ie. number of months since sign up)
     *
     * @returns {*}
     */
    UserSchema.methods.getCurrentPeriod = function() {
        var now = moment(new Date());
        var signupCompletedOn = getNormalizedDate(this.signupCompletedOn);
        return now.diff(signupCompletedOn, 'months');
    };

    /**
     * Gets the period of the date provided.
     *
     * @param startDate
     * @returns {*}
     */
    UserSchema.methods.getPeriodFromStartDate = function(startDate) {
        var signupCompletedOn = getNormalizedDate(this.signupCompletedOn);
        return moment(startDate).diff(signupCompletedOn, 'months');
    };

    /**
     * Gets the start date of the billing and printing period
     *
     * @returns {*}
     */
    UserSchema.methods.getCurrentPeriodStartDate = function() {
        var numberOfMonths = this.getCurrentPeriod();

        return this.getPeriodStartDate(numberOfMonths);
    };

    /**
     * Gets the end date of the billing and printing period
     *
     * @returns {*}
     */
    UserSchema.methods.getCurrentPeriodEndDate = function() {
        var startDate = moment(this.getCurrentPeriodStartDate());
        return new Date(startDate.add(1, 'months'));
    };

    /**
     * Get a previous period start date.
     *
     * @param numberOfMonths
     * @returns {Date}
     */
    UserSchema.methods.getPreviousPeriodStartDate = function(numberOfMonths) {
        var currentPeriod = moment(this.getCurrentPeriodStartDate());

        return new Date(currentPeriod.subtract(numberOfMonths || 1, 'months'));
    };

    /**
     * Gets the start date of the passed period
     *
     * @param numberOfMonths
     * @returns {Date}
     */
    UserSchema.methods.getPeriodStartDate = function(period) {
        var signupCompletedOn = getNormalizedDate(this.signupCompletedOn);

        return new Date(signupCompletedOn.add(period || 0, 'months'));
    };

    /**
     * Returns the end period date.
     *
     * @param period
     * @returns {Date}
     */
    UserSchema.methods.getPeriodEndDate = function(period) {
        var signupCompletedOn = getNormalizedDate(this.signupCompletedOn);

        return new Date(signupCompletedOn.add((period || 0) + 1, 'months'));
    };

    /**
     * Returns if the user is active based on signup completed and active.
     *
     * @returns {boolean}
     */
    UserSchema.methods.isActive = function() {
        return !!this.active && !!this.signupComplete;
    };

    //index jobs
    UserSchema.index({email: 1});
    UserSchema.index({'instagram.id': 1});
    UserSchema.index({'instagram.username': 1});
    UserSchema.index({active: 1});

    return mongoose.model('User', UserSchema);
}

function getNow() {
    return moment().
    tz(this.timezone || 'Australia/Melbourne');
}

function getNormalizedDate(date) {
    return moment(date).
    tz(this.timezone || 'Australia/Melbourne').
    startOf('day');
}

module.exports = exports = new User();

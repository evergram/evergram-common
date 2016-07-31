/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
var mongoose = require('mongoose');
var Payment = require('./payment');
var moment = require('moment-timezone');
var logger = require('../utils').logger;

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
        payments: [Payment.Schema],
        jobs: {
            instagram: {
                inQueue: {
                    type: Boolean,
                    default: false
                },
                lastRunOn: {type: Date},
                nextRunOn: {type: Date}
            }
        },
        instagram: {
            activeService: {
                type: Boolean,
                default: false
            },
            id: {type: String},
            username: {
                type: String,
                default: ''
            },
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
        facebook: {
            activeService: {
                type: Boolean,
                default: false
            },
            id: {type: String},
            messengerId: {type: String},
            authToken: {type: String},
            profilePicture: {
                type: String,
                default: ''
            },
            profileLink: {
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
        signupCompletedOn: {type: Date},
        referringUser: {
            instagramUsername:{
                type: String,
                default: ''
            },
            credited: {
                type: Boolean,
                default: false
            }
        },
        communications: {
            admin: {
                showConnectInstagramMsg: {
                    type: Boolean,
                    default: true
                },
                showConnectFacebookMsg: {
                    type: Boolean,
                    default: true
                }
            }
        }
    });

    /**
     * Set createdOn to today's date (normalised to 12:00am) when new record is created.
     *
     * @returns {*}
     */
    UserSchema.pre('save', function(next) {
        //TODO consider daylight savings and other timezones. eg .isDST() or moment.utc()
        if (!_.isDate(this.createdOn)) {
            this.createdOn = getNormalizedDate();
        }

        //set the signup completed on date
        if (!_.isDate(this.signupCompletedOn) && this.signupComplete) {
            this.signupCompletedOn = getNormalizedDate();
        }

        this.updatedOn = moment();

        next();
    });

    /**
     * Get username. Allow pre-Facebook integration code to access instagram username.
     *
     * @returns URI encoded string in the format {.firsName-.lastName._id}
     */
    UserSchema.methods.getUsername = function() {

        return encodeURI(this.firstName + '-' + this.lastName + '.' + this._id);
    };

    /**
     * Get a unique social id based on service passed
     *
     * @params  service as String {Instagram|Facebook}
     * @returns {.{instagram|facebook}.id|*}
     */
    UserSchema.methods.getSocialId = function(service) {
        if (service === 'Instagram') 
            return this.instagram.id;
        else if (service === 'Facebook')
            return this.facebook.id;
    };

    /**
     * Get an array containing the user's active (has been authed) social services
     *
     * @returns {array} containing .instagram|.facebook objects if active services
     */
    UserSchema.methods.getActiveServices = function() {
        var services = [];

        if (this.instagram.activeService) {
            services.push(this.instagram);
        }
        if (this.facebook.activeService) {
            services.push(this.facebook);
        }

        return services;
    };

    /**
     * Determines if service is active (has been authed) for this user
     *
     * @params  service as String {Instagram|Facebook}
     * @returns {bool}
     */
    UserSchema.methods.isActiveService = function(service) {

        if (service === 'Instagram') {
            return this.instagram.activeService;
        } else if (service === 'Facebook') {
            return this.facebook.activeService;
        }
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
        var signupCompletedOn = moment(this.signupCompletedOn);
        return now.diff(signupCompletedOn, 'months');
    };

    /**
     * Gets the period of the date provided.
     *
     * @param startDate
     * @returns {*}
     */
    UserSchema.methods.getPeriodFromStartDate = function(startDate) {
        var signupCompletedOn = moment(this.signupCompletedOn);
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
        var signupCompletedOn = moment(this.signupCompletedOn);

        return new Date(signupCompletedOn.add(period || 0, 'months'));
    };

    UserSchema.methods.getPeriodEndDate = function(period) {
        var signupCompletedOn = moment(this.signupCompletedOn);

        return new Date(signupCompletedOn.add((period || 0) + 1, 'months'));
    };

    //index jobs
    UserSchema.index({email: 1});
    UserSchema.index({'instagram.id': 1});
    UserSchema.index({'instagram.username': 1});
    UserSchema.index({'facebook.id': 1});
    UserSchema.index({
        'jobs.instagram.lastRunOn': 1,
        'jobs.instagram.inQueue': 1,
        active: 1
    });

    return mongoose.model('User', UserSchema);
}

function getNormalizedDate() {
    return moment().
        tz(this.timezone || 'Australia/Melbourne').
        startOf('day');
}

module.exports = exports = new User();

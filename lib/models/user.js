/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');
var Payment = require('./payment');
var moment = require('moment');

var Schema = mongoose.Schema;

function User() {
    /**
     * User Schema
     */
    var UserSchema = new Schema({
        firstName: {type: String, default: ''},
        lastName: {type: String, default: ''},
        email: {type: String, default: ''},
        address: {
            line1: {type: String, default: ''},
            line2: {type: String, default: ''},
            suburb: {type: String, default: ''},
            postcode: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        billing: {
            option: {type: String, default: ''},
            stripeId: {type: String, default: ''}
        },
        createdOn: {type: Date},
        updatedOn: {type: Date},
        payments: [Payment.Schema],
        jobs: {
            instagram: {
                inQueue: {type: Boolean, default: false},
                lastRunOn: {type: Date},
                nextRunOn: {type: Date}
            },
            printing: {
                inQueue: {type: Boolean, default: false},
                lastRunOn: {type: Date},
                nextRunOn: {type: Date}
            },
            billing: {
                lastBilledOn: {type: Date},
                nextBillDueOn: {type: Date}
            }
        },
        instagram: {
            id: {type: String},
            username: {type: String},
            authToken: {type: String},
            follows: {type: Number, default: 0},
            followers: {type: Number, default: 0},
            media: {type: Number, default: 0},
            profilePicture: {type: String, default: ''},
            website: {type: String, default: ''},
            bio: {type: String, default: ''}
        },
        active: {type: Boolean, default: true, index: true}
    });

    /**
     * Get a unique username
     *
     * @returns {.instagram.username|*}
     */
    UserSchema.methods.getUsername = function () {
        return this.instagram.username;
    };

    /**
     * Determines if the user is still in their first period
     *
     * @returns {*}
     */
    UserSchema.methods.isInFirstPeriod = function () {
        return this.getCurrentPeriod() == 0;
    };

    /**
     * Gets the period number (ie. number of months since sign up)
     *
     * @returns {*}
     */
    UserSchema.methods.getCurrentPeriod = function () {
        var now = moment(new Date);
        var createdOn = moment(this.createdOn);
        return now.diff(createdOn, 'months');
    };

    /**
     * Gets the period of the date provided.
     *
     * @param startDate
     * @returns {*}
     */
    UserSchema.methods.getPeriodFromStartDate = function (startDate) {
        var createdOn = moment(this.createdOn);
        return moment(startDate).diff(createdOn, 'months');
    };

    /**
     * Gets the start date of the billing and printing period
     *
     * @returns {*}
     */
    UserSchema.methods.getCurrentPeriodStartDate = function () {
        var numberOfMonths = this.getCurrentPeriod();

        return this.getPeriodStartDate(numberOfMonths);
    };

    /**
     * Gets the end date of the billing and printing period
     *
     * @returns {*}
     */
    UserSchema.methods.getCurrentPeriodEndDate = function () {
        var startDate = moment(this.getCurrentPeriodStartDate());
        return new Date(startDate.add(1, 'months'));
    };

    /**
     * Get a previous period start date.
     *
     * @param numberOfMonths
     * @returns {Date}
     */
    UserSchema.methods.getPreviousPeriodStartDate = function (numberOfMonths) {
        var currentPeriod = moment(this.getCurrentPeriodStartDate());

        return new Date(currentPeriod.subtract(numberOfMonths || 1, 'months'));
    };

    /**
     * Gets the start date of the passed period
     *
     * @param numberOfMonths
     * @returns {Date}
     */
    UserSchema.methods.getPeriodStartDate = function (period) {
        var createdOn = moment(this.createdOn);

        return new Date(createdOn.add(period || 0, 'months'));
    };

    UserSchema.methods.getPeriodEndDate = function (period) {
        var createdOn = moment(this.createdOn);

        return new Date(createdOn.add((period || 0) + 1, 'months'));
    };

    //index jobs
    UserSchema.index({'email': 1, 'active': 1});
    UserSchema.index({'instagram.id': 1, 'active': 1});
    UserSchema.index({'jobs.instagram.lastRunOn': 1, 'jobs.instagram.inQueue': 1, 'active': 1});
    UserSchema.index({'jobs.printing.lastRunOn': 1, 'jobs.printing.inQueue': 1, 'active': 1});

    return mongoose.model('User', UserSchema);
}

module.exports = exports = new User;

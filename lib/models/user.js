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
        name: {type: String, default: ''},
        email: {type: String, default: ''},
        address: {
            line1: {type: String, default: ''},
            line2: {type: String, default: ''},
            suburb: {type: String, default: ''},
            postcode: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        billingOption: {type: String, default: ''},
        createdOn: {type: Date},
        updatedOn: {type: Date},
        payments: [Payment.Schema],
        jobs: {
            instagram: {
                inQueue: {type: Boolean, default: false},
                lastRunOn: {type: Date}
            },
            printing: {
                inQueue: {type: Boolean, default: false},
                lastRunOn: {type: Date}
            },
            billing: {
                lastBilledOn: {type: Date},
                nextBillDueOn: {type: Date}
            }
        },
        instagram: {
            id: {type: String},
            authToken: {type: String},
            profile: {}
        },
        active: {type: Boolean, default: true, index: true}
    });

    /**
     * Gets the number of months since signing up
     *
     * @returns {*}
     */
    UserSchema.methods.getCurrentPeriodStartDate = function () {
        var now = moment(new Date);
        var createdOn = moment(this.createdOn);
        var numberOfMonths = now.diff(createdOn, 'months');

        return createdOn.add(numberOfMonths, 'months');
    };

    //index jobs
    UserSchema.index({'email': 1, 'active': 1});
    UserSchema.index({'instagram.id': 1, 'active': 1});
    UserSchema.index({'jobs.instagram.lastRunOn': 1, 'jobs.instagram.inQueue': 1, 'active': 1});
    UserSchema.index({'jobs.printing.lastRunOn': 1, 'jobs.printing.inQueue': 1, 'active': 1});

    return mongoose.model('User', UserSchema);
}

module.exports = exports = new User;

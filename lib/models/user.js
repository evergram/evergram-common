/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var mongoose = require('mongoose');
var Payment = require('./payment');

var Schema = mongoose.Schema;

function User() {
    /**
     * User Schema
     */

    var UserSchema = new Schema({
        name: {type: String, default: ''},
        email: {type: String, default: '', index: true},
        address: {
            line1: {type: String, default: ''},
            line2: {type: String, default: ''},
            suburb: {type: String, default: ''},
            postcode: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        provider: {type: String, default: ''},
        authToken: {type: String, default: ''},
        billingOption: {type: String, default: ''},
        createdOn: {type: Date, default: new Date()},
        updatedOn: {type: Date},
        payments: [Payment],
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
            id: {type: String, index: true},
            profile: {}
        },
        active: {type: Boolean, default: true}
    });

    //index jobs
    UserSchema.index({'jobs.instagram.nextRunOn': 1, 'jobs.instagram.inQueue': 1});
    UserSchema.index({'jobs.printing.nextRunOn': 1, 'jobs.printing.inQueue': 1});

    return mongoose.model('User', UserSchema);
}

module.exports = exports = new User;

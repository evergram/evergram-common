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
        email: {type: String, default: ''},
        address: {
            line1: {type: String, default: ''},
            line2: {type: String, default: ''},
            suburb: {type: String, default: ''},
            postcode: {type: String, default: ''},
            country: {type: String, default: ''}
        },
        provider: {type: String, default: ''},
        authToken: {type: String, default: ''},
        billing: {
            option: {type: String, default: ''),
            stripeID: {type: String, default: ''}
        },
        createdOn: {type: Date, default: new Date()},
        updatedOn: {type: Date},
        payments: [Payment],
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
            username: {type: String},
            profile: {}
        },
        active: {type: Boolean, default: true, index: true}
    });

    //index jobs
    UserSchema.index({'email': 1, 'active': 1});
    UserSchema.index({'instagram.id': 1, 'active': 1});
    UserSchema.index({'jobs.instagram.lastRunOn': 1, 'jobs.instagram.inQueue': 1, 'active': 1});
    UserSchema.index({'jobs.printing.lastRunOn': 1, 'jobs.printing.inQueue': 1, 'active': 1});

    return mongoose.model('User', UserSchema);
}

module.exports = exports = new User;

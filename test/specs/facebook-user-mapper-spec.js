/**
 * @author Richard O'Brien <richard@printwithpixy.com>.
 */
var should = require('should');
var sinon = require('sinon');
var q = require('q');
var moment = require('moment');
var db = require('../../lib/db');
var facebookUser = require('../../lib/mapper/facebookUser');

describe('Map Facebook User profile to Pixy User model', function() {

    var data;

    before(function(done) {
        db.connect().
        then(function() {
            done();
        });
    });

    beforeEach(function(done) {
        
        data = { 
            'id': '10153362229936821',
            'displayName': 'Richard O\'Brien',
            'name': { 
                'familyName': 'O\'Brien',
                'givenName': 'Richard'
            },
            'profileUrl': 'https://www.facebook.com/app_scoped_user_id/10153362229936821/',
            'emails': [ 
                { 'value': 'dicksta@gmail.com' }
            ],
            'photos': [ 
                { 'value': 'https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/s200x200/302309_10151027327301821_602745376_n.jpg?oh=d7cd8514d2a58e81864a64213ac5138d&oe=576EC3EC' } ],
            'provider': 'facebook',
            '_json': {
                'id': '10153362229936821',
                'name': 'Richard O\'Brien',
                'last_name': 'O\'Brien',
                'first_name': 'Richard',
                'email': 'dicksta@gmail.com',
                'picture': { 
                    'is_silhouette': false,
                    'url': 'https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/s200x200/302309_10151027327301821_602745376_n.jpg?oh=d7cd8514d2a58e81864a64213ac5138d&oe=576EC3EC' 
                },
                'link': 'https://www.facebook.com/app_scoped_user_id/10153362229936821/'
            },
            'authToken': 'CAANSeZAKZBGZCYBAAr2Qm0uPAiO9PoDD3K6PvKJWlOsFdm6gtts4AOCLJlr2ivl8ktwvrT0dnh9tdZC7SICGrtsAWZBMEkcEogHXe74zvH3bbLXF2ZCGmZAAEXneG0WM0CwHlyQNZAwDC9If8osxvtRLFYtbjze5otubq7qp9zJm8pQ45jFl2JekarHWYTO1oIu1lGpePkg2QAZDZD'
        };

        done();
    });

    afterEach(function(done) {

        q.all([]).
        then(function() {
            done();
        });
    });

    it('should create a user when no user is passed', function(done) {
        const user = {};

        var newUser = facebookUser.toModel(data, user);
        
        should.exist(newUser);

        newUser.firstName.should.be.eql("Richard");
        newUser.lastName.should.be.eql("O\'Brien");
        newUser.email.should.be.eql("dicksta@gmail.com");
        newUser.facebook.activeService.should.be.eql(true);
        newUser.facebook.id.should.be.eql("10153362229936821");
        newUser.facebook.authToken.should.be.eql("CAANSeZAKZBGZCYBAAr2Qm0uPAiO9PoDD3K6PvKJWlOsFdm6gtts4AOCLJlr2ivl8ktwvrT0dnh9tdZC7SICGrtsAWZBMEkcEogHXe74zvH3bbLXF2ZCGmZAAEXneG0WM0CwHlyQNZAwDC9If8osxvtRLFYtbjze5otubq7qp9zJm8pQ45jFl2JekarHWYTO1oIu1lGpePkg2QAZDZD");
        newUser.facebook.profilePicture.should.be.eql("https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/s200x200/302309_10151027327301821_602745376_n.jpg?oh=d7cd8514d2a58e81864a64213ac5138d&oe=576EC3EC");
        newUser.facebook.profileLink.should.be.eql("https://www.facebook.com/app_scoped_user_id/10153362229936821/");

        done();
    });

    it('should update user when a user is passed', function(done) {
        const user = {
            "_id" : 'ObjectId("5694cc3daa7774c966202e5d")',
            "updatedOn" : 'ISODate("2016-01-20T06:22:58.000Z")',
            "createdOn" : 'ISODate("2016-01-11T13:00:00.000Z")',
            "signupComplete" : true,
            "active" : true,
            "timezone" : "Australia/Melbourne",
            "instagram" : {
                "id" : "227081463",
                "username" : "rikileela",
                "authToken" : "227081463.2fd0517.df8d134ca4ec48ffaf74169d2d95551f",
                "follows" : 190,
                "followers" : 45,
                "media" : 154
            },
            "jobs" : {
                "instagram" : {
                    "inQueue" : true,
                    "lastRunOn" : 'ISODate("2016-01-20T06:07:49.134Z")',
                    "nextRunOn" : 'ISODate("2016-01-20T06:22:49.134Z")'
                }
            },
            "payments" : [],
            "billing" : {
                "option" : "GIFT3",
                "stripeId" : "cus_7hoRRwvDHwcJJm"
            },
            "address" : {
                "country" : "Australia",
                "postcode" : "3556",
                "state" : "vic",
                "suburb" : "Eaglehawk",
                "line1" : "59 Church St"
            },
            "email" : "rlbrow@hotmail.com",
            "lastName" : "Coates",
            "firstName" : "Riki",
            "__v" : 0,
            "signupCompletedOn" : 'ISODate("2016-01-11T13:00:00.000Z")'
        };

        var updatedUser = facebookUser.toModel(data, user);
        
        should.exist(updatedUser);

        updatedUser.firstName.should.be.eql("Richard");
        updatedUser.lastName.should.be.eql("O\'Brien");
        updatedUser.email.should.be.eql("dicksta@gmail.com");
        updatedUser.facebook.activeService.should.be.eql(true);
        updatedUser.facebook.id.should.be.eql("10153362229936821");
        updatedUser.facebook.authToken.should.be.eql("CAANSeZAKZBGZCYBAAr2Qm0uPAiO9PoDD3K6PvKJWlOsFdm6gtts4AOCLJlr2ivl8ktwvrT0dnh9tdZC7SICGrtsAWZBMEkcEogHXe74zvH3bbLXF2ZCGmZAAEXneG0WM0CwHlyQNZAwDC9If8osxvtRLFYtbjze5otubq7qp9zJm8pQ45jFl2JekarHWYTO1oIu1lGpePkg2QAZDZD");
        updatedUser.facebook.profilePicture.should.be.eql("https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/s200x200/302309_10151027327301821_602745376_n.jpg?oh=d7cd8514d2a58e81864a64213ac5138d&oe=576EC3EC");
        updatedUser.facebook.profileLink.should.be.eql("https://www.facebook.com/app_scoped_user_id/10153362229936821/");

        done();
    });
});

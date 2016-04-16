/**
 * @author Richard O'Brien <richard@printwithpixy.com>.
 */
var should = require('should');
var sinon = require('sinon');
var q = require('q');
var moment = require('moment');
var db = require('../../lib/db');
var userManager = require('../../lib/user/manager');
var User = require('../../lib/models/user');

describe('Retrieve information from Pixy User model', function() {

    var user;

    before(function(done) {
        db.connect().
        then(function() {
            done();
        });
    });

    beforeEach(function(done) {
        
        user = new User({
            "_id" : 'ObjectId("5694cc3daa7774c966202e5d")',
            "updatedOn" : 'ISODate("2016-01-20T06:22:58.000Z")',
            "createdOn" : 'ISODate("2016-01-11T13:00:00.000Z")',
            "signupComplete" : true,
            "active" : true,
            "timezone" : "Australia/Melbourne",
            "instagram" : {
                "activeService" : true,
                "id" : "227081463",
                "username" : "rikileela",
                "authToken" : "227081463.2fd0517.df8d134ca4ec48ffaf74169d2d95551f",
                "follows" : 190,
                "followers" : 45,
                "media" : 154,
                "profilePicture" : "https://scontent.cdninstagram.com/t51.2885-19/s150x150/12331936_1665928473684089_325683634_a.jpg",
                "website" : "http://www.sometestwebsite.com",
                "bio" : "This is my bio"
            },
            "facebook" : {
                "activeService" : true,
                "id" : "149263415461127",
                "authToken" : "CAANSeZAKZBGZCYBABXjOZBeLPU3VFbZAEacrFmdJZAkmEeYnZCW3NlbYANTd9rgeveSsjTxTRcefSNrOhBRt4za9uMSugJaa8AYWFrhZCgVeUjXr3qU8Qcfvp3CzEzYBZBedRHWYxrekyp26SEnRDiLZAyZCxpHnFLgA2XSZCTb5RdelmRZCZAm4E09NPpkbkE9O1ds70ZD",
                "profilePicture" : "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xtl1/v/t1.0-1/p200x200/12717964_149273018793500_6305364463130627389_n.jpg?oh=b594f46285737260f21919d17c47404c&oe=57575537&__gda__=1466586070_1324f3bfaef2b98b67b42de92985a885",
                "profileLink" : "https://www.facebook.com/app_scoped_user_id/149263415461127/"
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
        });

        done();
    });

    afterEach(function(done) {

        q.all([]).
        then(function() {
            done();
        });
    });

    // TODO: write tests for all date/period related methods.
 
    it('getUsername() should return instagram.username when no service is passed', function(done) {
        
        //...
        should.exist(user);

        user.getUsername().should.be.eql('rikileela');

        done();
    });

    // getUsername should return facebook.id when "facebook" is passed as service
    it('getUsername() should return facebook.id when "facebook" is passed as service', function(done) {
        
        //...
        should.exist(user);

        user.getUsername('facebook').should.be.eql('149263415461127');

        done();
    });

    // getSocialId should return instagram.id when "instagram" is passed
    it('getSocialId() should return instagram.id when "instagram" is passed', function(done) {
        
        //...
        should.exist(user);

        user.getSocialId('instagram').should.be.eql('227081463');

        done();
    });

    // getSocialId should return facebook.id when "facebook" is passed
    it('getSocialId() should return facebook.id when "facebook" is passed', function(done) {
        
        //...
        should.exist(user);

        user.getSocialId('facebook').should.be.eql('149263415461127');

        done();
    });

    // getActiveServices() should return an array containing the user's instagram & facebook objects
    it('getActiveServices() should return an array containing the users instagram & facebook objects', function(done) {
        
        //...
        should.exist(user);

        var services = user.getActiveServices();

        services.should.matchAny(user.facebook, 'Facebook not returned as an active service.');
        services.should.matchAny(user.instagram, 'Instagram not returned as an active service.');

        done();
    });

    // isActiveService() should return the activeService value based on the service passed
    it('isActiveService() should return the activeService value based on the service passed', function(done) {
        
        //...
        should.exist(user);

        user.isActiveService('facebook').should.be.eql(true, 'Facebook should be active but returned false.');
        user.isActiveService('instagram').should.be.eql(true, 'Instagram should be active but returned false.');

        done();
    });
});

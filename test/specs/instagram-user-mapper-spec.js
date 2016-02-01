/**
 * @author Richard O'Brien <richard@printwithpixy.com>.
 */
var should = require('should');
var sinon = require('sinon');
var q = require('q');
var moment = require('moment');
var db = require('../../lib/db');
var instagramUser = require('../../lib/mapper/instagramUser');

describe('Map Instagram User profile to Pixy User model', function() {

    var data;

    before(function(done) {
        db.connect().
        then(function() {
            done();
        });
    });

    beforeEach(function(done) {
        
        data = {
            "authToken" : "1574083.2fd0517.1097afd5d55543e3bbbf7003c49fe3d6",
            "_json" : {
                "data" : {
                    "id": "1574083",
                    "username": "snoopdogg",
                    "full_name": "Snoop Dogg",
                    "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg",
                    "bio": "This is my bio",
                    "website": "http://snoopdogg.com",
                    "counts": {
                        "media": 1320,
                        "follows": 420,
                        "followed_by": 3410
                    }
                }
            }
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

        var newUser = instagramUser.toModel(data, user);
        
        should.exist(newUser);

        newUser.firstName.should.be.eql("Snoop");
        newUser.lastName.should.be.eql("Dogg");
        newUser.instagram.id.should.be.eql("1574083");
        newUser.instagram.username.should.be.eql("snoopdogg");
        newUser.instagram.authToken.should.be.eql("1574083.2fd0517.1097afd5d55543e3bbbf7003c49fe3d6");
        newUser.instagram.follows.should.be.eql(420);
        newUser.instagram.followers.should.be.eql(3410);
        newUser.instagram.media.should.be.eql(1320);
        newUser.instagram.profilePicture.should.be.eql("http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg");
        newUser.instagram.website.should.be.eql("http://snoopdogg.com");
        newUser.instagram.bio.should.be.eql("This is my bio");

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

        var newUser = instagramUser.toModel(data, user);
        
        should.exist(newUser);

        newUser.firstName.should.be.eql("Snoop");
        newUser.lastName.should.be.eql("Dogg");
        newUser.instagram.id.should.be.eql("1574083");
        newUser.instagram.username.should.be.eql("snoopdogg");
        newUser.instagram.authToken.should.be.eql("1574083.2fd0517.1097afd5d55543e3bbbf7003c49fe3d6");
        newUser.instagram.follows.should.be.eql(420);
        newUser.instagram.followers.should.be.eql(3410);
        newUser.instagram.media.should.be.eql(1320);
        newUser.instagram.profilePicture.should.be.eql("http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg");
        newUser.instagram.website.should.be.eql("http://snoopdogg.com");
        newUser.instagram.bio.should.be.eql("This is my bio");

        done();
    });

    it('should split full name across firstname and lastname fields', function(done) {
        const user = {};

        var newUser = instagramUser.toModel(data, user);
        
        should.exist(newUser);

        newUser.firstName.should.not.be.eql("Snoop Dogg");
        newUser.lastName.should.not.be.eql("Snoop Dogg");

        done();
    });
});

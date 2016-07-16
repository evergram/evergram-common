/**
 * @author Richard O'Brien <richard@printwithpixy.com>
 */

var User = require('../models').User;

function FacebookUser() {
}

/**
 * Converts to a model
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
FacebookUser.prototype.toModel = function(data, user) {

    if (!user) {
        user = new User();
    }

    //user.firstName = !!data.name.givenName ? data.name.givenName : '';
    //user.lastName = !!data.name.familyName ? data.name.familyName : '';
    //user.email = !!data.emails[0].value ? data.emails[0].value : '';
    user.facebook = {
        activeService: true,
        id: data.id,
        authToken: data.authToken,
        profilePicture: !!data.photos ? data.photos[0].value : '',
        profileLink: !!data.profileUrl ? data.profileUrl : '',
        messengerId: !!user.facebook.messengerId ? user.facebook.messengerId : ''
    };
    
    return user;
};

module.exports = exports = new FacebookUser();

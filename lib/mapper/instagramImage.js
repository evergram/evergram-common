/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var moment = require('moment');
var Image = require('../models').Image;

/**
 * Converts instagram data to an image model
 *
 * @constructor
 */
function InstagramImageMapper() {
}

/**
 * Converts to a model
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
InstagramImageMapper.prototype.toModel = function (data, user) {
    return new Image({
        _id: data.id,
        owner: data.user.username,
        isOwner: data.user.username == user.instagram.username,
        createdOn: moment.unix(data.created_time),
        taggedOn: moment(),
        src: {
            raw: data.images.standard_resolution.url
        },
        metadata: data
    });
};

module.exports = exports = new InstagramImageMapper;

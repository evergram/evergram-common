/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

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
        date: new Date(data.created_time * 1000),
        src: {
            raw: data.images.standard_resolution.url
        },
        metadata: data
    });
};

module.exports = exports = new InstagramImageMapper;

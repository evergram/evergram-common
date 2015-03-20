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
 * @returns {promise|*|Q.promise}
 */
InstagramImageMapper.prototype.toModel = function (data) {
    return new Image({
        _id: data.id,
        date: new Date(data.created_time * 1000),
        src: {
            raw: data.images.standard_resolution.url
        },
        metadata: data
    });
};

module.exports = exports = new InstagramImageMapper;

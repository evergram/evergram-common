/**
 * @author Richard O'Brien <richard@stichmade.com>
 */

var moment = require('moment');
var Image = require('../models').Image;

/**
 * Converts instagram data to an image model
 *
 * @constructor
 */
function FacebookImageMapper() {
}

/**
 * Converts to a model
 *
 * @param options
 * @returns {promise|*|q.promise}
 */
FacebookImageMapper.prototype.toModel = function(data, user) {
    return new Image({
        owner: user.facebook.id,
        isOwner: true,
        taggedOn: data.timestamp,
        src: {
            raw: data.attachment.payload.url
        },
        metadata: {
            mid: data.mid
        }
    });
};

module.exports = exports = new FacebookImageMapper();

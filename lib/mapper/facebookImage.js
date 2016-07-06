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
        taggedOn: data.created_time,
        src: {
            raw: data.images[0].source
        },
        metadata: {
            link: data.link,
            printSize: data.images[0].printSize
        }
    });
};

module.exports = exports = new FacebookImageMapper();
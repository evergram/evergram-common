/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var fs = require('fs');
var config = require('../../config');
var request = require('request');
var tmp = require('tmp');

/**
 *
 * @param user
 * @constructor
 */
function ImageManager() {
    this.dir = config.tempDirectory;
}

/**
 * Save the file to a local temp directory
 * @param url
 * @param filename
 * @returns {promise|*|Q.promise}
 */
ImageManager.prototype.saveFromUrl = function (url, filename) {
    var deferred = q.defer();

    request.head(url, (function (err, res, body) {
        if (!filename) {
            filename = tmp.tmpNameSync() + getExtensionFromMime(res.headers['content-type']);
        } else {
            filename = this.dir + filename + getExtensionFromMime(res.headers['content-type'])
        }

        request(url).pipe(fs.createWriteStream(filename)).on('close', function () {
            deferred.resolve(filename);
        });
    }).bind(this));

    return deferred.promise;
};

function getExtensionFromMime(mime) {
    var ext;

    switch (mime) {
        case 'image/jpeg':
        case 'image/jpg':
            ext = '.jpg';
            break;

        case 'image/png':
            ext = '.png';
            break;
    }

    return ext;
}

function createDirectory(dir) {
    try {
        fs.mkdirSync(dir);
    } catch (e) {

    }
}

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new ImageManager;

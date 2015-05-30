/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var q = require('q');
var fs = require('fs');
var config = require('../../config');
var https = require('https');
var tmp = require('tmp');

/**
 *
 * @param user
 * @constructor
 */
function ImageManager() {
    this.tempDir = config.tempDirectory;

}

/**
 * Save the file to a local temp directory
 * @param url
 * @param filename
 * @returns {promise|*|q.promise}
 */
ImageManager.prototype.saveFromUrl = function(url, filename, dir) {
    var deferred = q.defer();

    try {
        https.get(url, (function(res) {
            if (!!res) {
                if (!filename) {
                    filename = tmp.tmpNameSync() + getExtensionFromMime(res.headers['content-type']);
                } else {
                    var fileDir = this.tempDir + dir;
                    if (!isDirectory(fileDir)) {
                        createDirectory(fileDir);
                    }

                    filename = this.tempDir + dir + '/' + filename + getExtensionFromMime(res.headers['content-type']);
                }

                var imagedata = '';
                res.setEncoding('binary');

                res.on('data', function(chunk) {
                    imagedata += chunk;
                });

                res.on('end', function() {
                    fs.writeFile(filename, imagedata, {encoding: 'binary'}, function(err) {
                        if (!err) {
                            deferred.resolve(filename);
                        } else {
                            deferred.reject(err);
                        }
                    });
                });
            } else {
                deferred.reject();
            }
        }).bind(this));
    } catch (err) {
        deferred.reject(err);
    }

    return deferred.promise;
};

function getExtensionFromMime(mime) {
    var ext;

    switch (mime) {
        case 'image/jpeg':
            ext = '.jpg';
            break;
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

function isDirectory(dir) {
    try {
        var stats = fs.lstatSync(dir);
        return stats.isDirectory();
    }
    catch (e) {
        return false;
    }
}

/**
 * Expose
 * @type {InstagramManager}
 */
module.exports = exports = new ImageManager();

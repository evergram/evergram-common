/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
var q = require('q');
var fs = require('fs');
var archiver = require('archiver');
var config = require('../config');

/**
 * A utils service
 *
 * @constructor
 */
function UtilsService() {
    this.dir = config.tempDirectory;
    this.createDirectory(this.dir);
}

UtilsService.prototype.zipFiles = function (files, filename) {
    var deferred = q.defer();
    var archive = archiver('zip');
    var file = this.dir + filename + '.zip';
    var output = fs.createWriteStream(file);

    output.on('close', function () {
        deferred.resolve(file);
    });
    archive.pipe(output);

    /**
     * Iterate through all files and add them to the archive
     */
    _.forEach(files, function (file) {
        archive.append(fs.createReadStream(file.filepath), {name: file.name});
    });
    archive.finalize();

    return deferred.promise;
};


UtilsService.prototype.createDirectory = function (dir) {
    try {
        fs.mkdirSync(dir);
    } catch (e) {

    }
};

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new UtilsService;
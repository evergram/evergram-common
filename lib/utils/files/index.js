/**
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

var _ = require('lodash');
var q = require('q');
var fs = require('fs');
var archiver = require('archiver');
var config = require('../../config');

/**
 * A utils service for files stuff
 *
 * @constructor
 */
function FilesUtilService() {
    this.tempDir = config.tempDirectory;
    this.createDirectory(this.tempDir);
}

/**
 * Zip the passed files
 *
 * @param files
 * @param filename
 * @returns {promise|*|Q.promise}
 */
FilesUtilService.prototype.zipFiles = function (files, filename) {
    var deferred = q.defer();
    var archive = archiver('zip');
    var file = this.tempDir + filename + '.zip';

    try {
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
    } catch (err) {
        console.error(err);
        deferred.reject(err);
    }

    return deferred.promise;
};

/**
 * Create the directory
 *
 * @param dir
 */
FilesUtilService.prototype.createDirectory = function (dir) {
    try {
        fs.mkdirSync(dir);
    } catch (e) {

    }
};

/**
 * Delete the dir recursively
 *
 * @param dir
 */
FilesUtilService.prototype.deleteDirectory = function (dir) {
    try {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((function (file, index) {
                var curPath = dir + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    this.deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            }).bind(this));

            fs.rmdirSync(dir);
        }
    } catch (err) {
        console.error('ERROR', err);
    }
};

/**
 * Deletes the passed directory using the temp directory as it's base.
 *
 * @param dir
 */
FilesUtilService.prototype.deleteFromTempDirectory = function (dir) {
    this.deleteDirectory(this.tempDir + '/' + dir);
};

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new FilesUtilService;
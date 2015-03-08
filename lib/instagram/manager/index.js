/**
 * Module dependencies.
 */


/**
 * Expose
 */

function Manager() {

}

Manager.prototype.findPosts = function (user) {
    console.log('finding posts');
};

Manager.prototype.savePosts = function (user, posts) {
    console.log('save posts');
};

module.exports = exports = new Manager();

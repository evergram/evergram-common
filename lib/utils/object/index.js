/**
 * @author Richard O'Brien <richard@stichmade.com>
 * @author Josh Stuart <joshstuartx@gmail.com>
 */

/**
 * A utils service for objects
 *
 * @constructor
 */
function ObjectUtilService() {

}

/**
 * Create a serialized representation of an array, or a plain object for use in a URL query string or Ajax request.
 *
 * @param obj
 */
ObjectUtilService.prototype.param = function (obj) {
    return '?' + Object.keys(obj).reduce(function (a, k) {
        a.push(k + '=' + encodeURIComponent(obj[k]));
        return a
    }, []).join('&');
};

/**
 * Expose
 * @type {UserService}
 */
module.exports = exports = new ObjectUtilService;
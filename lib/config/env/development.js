/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/evergram',
    instagram: {
        clientID: "cc3ecfbc78e448a18444e285547f373f",
        clientSecret: "01975ff2c9d94fe1a8d970c4fbff2a76",
        callbackURL: "http://localhost:8080/user/auth/instagram/callback",
        redirect: {
            success: "http://localhost:8080/success",
            fail: "http://localhost:8080"
        }
    }
};

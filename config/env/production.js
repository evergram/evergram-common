/**
 * Expose
 */

module.exports = {
    db: process.env.MONGO,
    facebook: {
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "http://nodejs-express-demo.herokuapp.com/auth/facebook/callback"
    }
};

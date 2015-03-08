/**
 * Expose
 */

module.exports = {
    db: process.env.MONGO,
    instagram: {
        clientID: process.env.INSTAGRAM_CLIENTID,
        clientSecret: process.env.INSTAGRAM_SECRET,
        callbackURL: process.env.API_ENDPOINT + "/user/auth/instagram/callback",
        redirect: {
            success: process.env.API_ENDPOINT + "/success",
            fail: process.env.API_ENDPOINT + "/failure"
        }
    }
};

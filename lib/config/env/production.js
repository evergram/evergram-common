/**
 * Expose
 */

module.exports = {
    db: process.env.MONGO,
    instagram: {
        clientID: process.env.INSTAGRAM_CLIENTID,
        clientSecret: process.env.INSTAGRAM_SECRET,
        callbackURL: process.env.API_ENDPOINT + '/auth/instagram/callback',
        redirect: {
            success: process.env.INSTAGRAM_REDIRECT_SUCCESS,
            fail: process.env.INSTAGRAM_REDIRECT_FAIL,
            loginSuccess: process.env.INSTAGRAM_LOGIN_SUCCESS,
            loginFail: process.env.INSTAGRAM_LOGIN_FAIL,
            reauth: process.env.INSTAGRAM_REDIRECT_RE_AUTH
        },
        printTag: process.env.EVERGRAM_PRINT_TAG || '\\@+(evergramco|printwithpixy)+',
        ignoreTag: process.env.EVERGRAM_IGNORE_TAG || '#+(dontprint)+'
    },
    facebook: {
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.API_ENDPOINT + '/auth/facebook/callback',
        verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
        pageToken: process.env.FACEBOOK_PAGE_TOKEN,
        redirect: {
            success: process.env.FACEBOOK_REDIRECT_SUCCESS,
            fail: process.env.FACEBOOK_REDIRECT_FAIL,
            loginSuccess: process.env.FACEBOOK_LOGIN_SUCCESS,
            loginFail: process.env.FACEBOOK_LOGIN_FAIL,
            reauth: process.env.FACEBOOK_REDIRECT_RE_AUTH
        },
        printTag: process.env.EVERGRAM_PRINT_TAG || '\\@+(printwithpixy)+',
        ignoreTag: process.env.EVERGRAM_IGNORE_TAG || '#+(dontprint)+'
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-west-2',
        s3: {
            bucket: process.env.S3_BUCKET || 'pixy-production'
        },
        sqs: {
            instagram: {
                url: process.env.SQS_INSTAGRAM_URL ||
                'https://sqs.us-west-2.amazonaws.com/981931412976/instagram-production',
                name: process.env.SQS_INSTAGRAM_NAME || 'instagram-production'
            },
            print: {
                url: process.env.SQS_PRINT_URL ||
                'https://sqs.us-west-2.amazonaws.com/981931412976/print-production',
                name: process.env.SQS_PRINT_NAME || 'print-production'
            }
        }
    },
    mandrill: {
        key: process.env.MANDRILL_API_KEY
    },
    print: {
        //months
        period: 1,
        sizes: {
            SQUARE: '4x4',
            STANDARD: '6x4'
        }
    },
    tracking: {
        writeKey: process.env.SEGMENT_IO_WRITE_KEY,
        readKey: process.env.SEGMENT_IO_READ_KEY,
        options: {}
    },
    logger: {
        prefix: process.env.LOGGER_PREFIX,
        transports: [
            'Papertrail'
        ],
        Papertrail: {
            host: 'logs2.papertrailapp.com',
            port: 39513
        }
    },
    tempDirectory: process.env.TEMP_DIR || './tmp/'
};

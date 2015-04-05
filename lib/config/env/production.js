/**
 * Expose
 */

module.exports = {
    db: process.env.MONGO,
    instagram: {
        clientID: process.env.INSTAGRAM_CLIENTID,
        clientSecret: process.env.INSTAGRAM_SECRET,
        callbackURL: process.env.API_ENDPOINT + '/user/auth/instagram/callback',
        redirect: {
            success: process.env.API_ENDPOINT + '/success',
            fail: process.env.API_ENDPOINT + '/failure'
        },
        printTag: process.env.EVERGRAM_PRINT_TAG || '#print @evergramco'
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-west-1',
        s3: {
            bucket: process.env.S3_BUCKET || 'evergram-prod'
        },
        sqs: {
            instagram: {
                url: process.env.SQS_INSTAGRAM_URL || 'https://sqs.us-west-1.amazonaws.com/326960013186/evergram-consumer-instagram',
                name: process.env.SQS_INSTAGRAM_NAME || 'evergram-consumer-instagram'
            },
            print: {
                url: process.env.SQS_PRINT_URL || 'https://sqs.us-west-1.amazonaws.com/326960013186/evergram-consumer-print',
                name: process.env.SQS_PRINT_NAME || 'evergram-consumer-print'
            }
        }
    },
    mandrill: {
        key: process.env.MANDRILL_API_KEY
    },
    print: {
        period: 1 //months
    },
    tempDirectory: process.env.TEMP_DIR || './tmp/'
};

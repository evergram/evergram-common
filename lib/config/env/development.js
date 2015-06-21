/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/evergram',
    instagram: {
        clientID: '2b5699325250466a941adf3abb7d903c',
        clientSecret: '493f4546ea7b4119b24f963194298b9a',
        callbackURL: 'http://localhost:8080/auth/instagram/callback',
        redirect: {
            success: 'http://localhost:9000/signup-step-2.html',
            fail: 'http://localhost:9000/failed.html',
            reauth: 'http://localhost:9000/reauth.html'
        },
        printTag: '\\@+(evergramco|printwithpixy)+',
        ignoreTag: '#+(dontprint)+'
    },
    aws: {
        accessKeyId: 'AKIAIK4ZH6VJDIK26TCA',
        secretAccessKey: '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',
        region: 'us-west-1',
        s3: {
            bucket: 'evergram-dev'
        },
        sqs: {
            instagram: {
                url: 'https://sqs.us-west-1.amazonaws.com/326960013186/evergram-dev-consumer-instagram',
                name: 'evergram-dev-consumer-instagram'
            },
            print: {
                url: 'https://sqs.us-west-1.amazonaws.com/326960013186/evergram-dev-consumer-print',
                name: 'evergram-dev-consumer-print'
            }
        }
    },
    mandrill: {
        //NOTE, this is just a test key and will not send email.
        key: '81i08pQS9MnpN7c-NfU3jQ'
    },
    print: {
        //months
        period: 1
    },
    tracking: {
        writeKey: null,
        readKey: null,
        options: {
            flushAt: 1
        }
    },
    logger: {
        prefix: 'dev -',
        transports: [
            'Console'
        ],
        Console: {}
    },
    tempDirectory: 'tmp/',
    stripe: {
        secretAccessKey: 'sk_test_KN8z6UJtLbBWITp7FZUGiWKI'
    }
};

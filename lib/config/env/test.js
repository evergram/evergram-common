/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/evergram-test',
    instagram: {
        clientID: '2b5699325250466a941adf3abb7d903c',
        clientSecret: '493f4546ea7b4119b24f963194298b9a',
        callbackURL: 'http://localhost:8080/auth/instagram/callback',
        redirect: {
            success: 'http://localhost:9000/signup-step-2.html',
            fail: 'http://localhost:9000/connect-failed.html',
            reauth: 'http://localhost:9000/re-auth-success.html'
        },
        printTag: '#print @evergramco'
    },
    aws: {
        accessKeyId: 'AKIAI6K7SLHTQ2DEGACA',
        secretAccessKey: '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',
        region: 'us-west-1',
        s3: {
            bucket: 'evergram-test'
        },
        sqs: {
            instagram: {
                url: 'https://sqs.us-west-1.amazonaws.com/326960013186/evergram-dev-consumer-instagram',
                name: 'evergram-dev-consumer-instagram'
            },
            print: {
                url: 'https://sqs.us-west-1.amazonaws.com/326960013186/evergram-test-consumer-print',
                name: 'evergram-test-consumer-print'
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
        options: {}
    },
    logger: {
        prefix: 'test -',
        transports: []
    },
    tempDirectory: 'tmp/',
    stripe: {
        secretAccessKey: 'sk_test_KN8z6UJtLbBWITp7FZUGiWKI'
    }
};

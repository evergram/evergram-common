/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/evergram-test',
    instagram: {
        clientID: 'cc3ecfbc78e448a18444e285547f373f',
        clientSecret: '01975ff2c9d94fe1a8d970c4fbff2a76',
        callbackURL: 'http://localhost:8080/user/auth/instagram/callback',
        redirect: {
            success: 'http://localhost:9000/signup-step-2.html',
            fail: 'http://www.evergram.co/connect-failed'
        },
        printTag: '#print @evergramco'
    },
    aws: {
        accessKeyId: 'AKIAIKXAZNMRCVWVVKVQ',
        secretAccessKey: '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',
        region: 'us-west-1',
        s3: {
            bucket: 'evergram-dev'
        },
        sqs: {
            instagram: {
                url: 'https://sqs.us-west-1.amazonaws.com/326960013186/evergram-consumer-instagram',
                name: 'evergram-consumer-instagram'
            },
            print: {
                url: 'https://sqs.us-west-1.amazonaws.com/326960013186/evergram-consumer-print',
                name: 'evergram-consumer-print'
            }
        }
    },
    mandrill: {
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
        transports: [
            'Console',
            'MongoDB'
        ],
        Console: {},
        MongoDB: {
            db: 'mongodb://localhost/evergram',
            collection: 'log'
        }
    },
    tempDirectory: 'tmp/'
};

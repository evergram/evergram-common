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
            success: "http://localhost:9000/signup-step-2.html",
            fail: "http://www.evergram.co/connect-failed"
        },
        printTag: '@evergramco'
        //printTag: '#print @evergramco' //TODO change to #print tag at some point
    },
    aws: {
        accessKeyId: "AKIAIKXAZNMRCVWVVKVQ",
        secretAccessKey: "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",
        region: "us-west-1",
        s3: {
            bucket: "evergram-dev"
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
        key: '81i08pQS9MnpN7c-NfU3jQ' //NOTE, this is just a test key and will not send email.
    },
    print: {
        period: 1 //months
    },
    tracking: {
        token: '84859c97b9b65d2ddd4ad332a318615b',
        apiKey: 'b69f5d1e735768474817808facdd7d8b',
        apiSecret: '1818dd8f2e2c687ac6fc20f78d23ef51'
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
        secretAccessKey: "sk_test_KN8z6UJtLbBWITp7FZUGiWKI"
    }
};

/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/pixy-test',
    instagram: {
        clientID: '2b5699325250466a941adf3abb7d903c',
        clientSecret: '493f4546ea7b4119b24f963194298b9a',
        callbackURL: 'http://localhost:8080/v1/auth/instagram/callback',
        redirect: {
            success: 'http://localhost:3000/signup-step-2',
            fail: 'http://localhost:3000/failed',
            loginSuccess: 'http://localhost:3000/my-account',
            loginFail: 'http://localhost:3000/login',
            reauth: 'http://localhost:3000/reauth'
        },
        printTag: '\\@+(evergramco|printwithpixy)+',
        ignoreTag: '#+(dontprint)+'
    },
    aws: {
        accessKeyId: 'AKIAJ5D256HPDLLQPYHA',
        secretAccessKey: '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',
        region: 'us-west-2',
        s3: {
            bucket: 'pixy-testing'
        },
        sqs: {
            instagram: {
                url: 'https://sqs.us-west-2.amazonaws.com/981931412976/instagram-testing',
                name: 'instagram-testing'
            },
            print: {
                url: 'https://sqs.us-west-2.amazonaws.com/981931412976/print-testing',
                name: 'print-testing'
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
    tempDirectory: 'tmp/'
};

/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/pixy-development',
    instagram: {
        clientID: '2b5699325250466a941adf3abb7d903c',
        clientSecret: '493f4546ea7b4119b24f963194298b9a',
        callbackURL: 'http://localhost:8080/v1/auth/instagram/callback',
        redirect: {
            success: 'http://localhost:3000/#/signup-step-2',
            fail: 'http://localhost:3000/#/failed',
            loginSuccess: 'http://localhost:3000/#/my-account',
            loginFail: 'http://localhost:3000/#/login',
            reauth: 'http://localhost:3000/#/reauth'
        },
        printTag: '\\@+(evergramco|printwithpixy)+',
        ignoreTag: '#+(dontprint)+'
    },
    aws: {
        accessKeyId: 'AKIAILVED25GYIPEIDZA',
        secretAccessKey: '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',
        region: 'us-west-2',
        s3: {
            bucket: 'pixy-development'
        },
        sqs: {
            instagram: {
                url: 'https://sqs.us-west-2.amazonaws.com/981931412976/instagram-development',
                name: 'instagram-development'
            },
            print: {
                url: 'https://sqs.us-west-2.amazonaws.com/981931412976/print-development',
                name: 'print-development'
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
        writeKey: 's1D3vxElH5eCPE5GvCgOYH4ISifPv8pk',
        readKey: null,
        options: {
            flushAt: 1
        }
    },
    logger: {
        prefix: 'dev -',
        transports: [
            'Console',
            'File'
        ],
        Console: {},
        File: {
            name: 'app-log',
            filename: 'logs/app.log'
        }
    },
    tempDirectory: 'tmp/'
};

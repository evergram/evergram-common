/**
 * Expose
 */

module.exports = {
    db: 'mongodb://localhost/pixy-test',
    instagram: {
        clientID: '1c04e583c6374c83b301cf730a9396a0',
        clientSecret: '546b8d7df0ca450fa74167036e1f4025',
        callbackURL: 'http://localhost:8080/v3/auth/instagram/callback',
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
    facebook: {
        clientID: '935107036584950',
        clientSecret: '0abf88902e40dd511315ec0f6db4bc17',
        callbackURL: 'http://localhost:8080/v3/auth/facebook/callback',
        verifyToken: 'd71a1cd2a6718da877a7a7acf370cd2992c50d46',
        pageToken: 'CAANSeXKOXSwBANK1Rxgs8eyAzfKNtB1LYWtbiOEMPhBJOWl2lVH7T7z2JQLm2oMGMioZCGJWpvxZC0JOpGTzQZA0QOOg7RCcameZBUOUiGtGPgIC0Xs2vjqSU9RZCNQZCuVNpxkv0XHIcUokkvenhNFpGRfNn6idRKArWM1WwbUe20DzvZAvDT646VlF13FxxUq3uVZAG7ZAbSgZDZD',
        redirect: {
            success: 'http://localhost:3000/#/signup-step-2',
            fail: 'http://localhost:3000/#/failed',
            loginSuccess: 'http://localhost:3000/#/my-account',
            loginFail: 'http://localhost:3000/#/login',
            reauth: 'http://localhost:3000/#/reauth'
        },
        printTag: '\\@+(printwithpixy)+',
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

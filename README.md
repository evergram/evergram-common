# Evergram Common
Common code to be shared amongst over Evergram micro services.

NOTE: This is not a stand alone app and is only intended to be a shared module.

###Install Node.JS

In the terminal:

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.24.0/install.sh | bash

nvm install stable
```

###Clone

```
git clone git@github.com:evergram/evergram-consumer-instagram.git
```

###Init

```
cd evergram-consumer-instagram
npm install
```

###Run

```
npm start
```

###Examples
##### An example on how to find printable images from an instagram user.

```js

var common = require('evergram-common');
var User = common.models.User;
var instagram = common.instagram;

var id = 'some user id';

User.findOne({'_id': id}, function (err, user) {
    instagram.manager.findPrintableImagesByUser(user)
        .then(function (images) {
            //display all printable images
            console.log(images);
        });
});
```


##### An example on how to add, retrieve and delete a message on AWS SQS

```js
var common = require('evergram-common');
var aws = common.aws;

aws.sqs.createMessage(aws.sqs.QUEUES.INSTAGRAM, '{"id": "test"}').then(function (result) {
    //created the message
    console.log('Created: ' + result.MessageId);

    aws.sqs.getMessage(aws.sqs.QUEUES.INSTAGRAM).then(function (results) {
        console.log('Retrieved: ', results[0].Body);
        aws.sqs.deleteMessage(aws.sqs.QUEUES.INSTAGRAM, results[0]).then(function (deleted) {
            console.log('Deleted');
        }, function (err) {
            console.error(err);
        });
    }, function (err) {
        console.error(err);
    });
});
```


##### Import user data from json

```
mongoimport -d evergram -c users --jsonArray ~/Downloads/Export_UserDataModel_280315.json
```
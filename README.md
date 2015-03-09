# evergram-common
Common code to be shared amongst node applications



An example on how to find and save printable posts from an instagram user.

```js
var instagram = this.instagram;

this.models.User.findOne({'username': 'joshstuartx'}, function (err, user) {
    if (user != null) {
        instagram.manager.findPrintablePosts({}, user, function (err, images) {
            instagram.manager.saveImages(err, images, function () {
                console.log('saved');
            });
        });
    }
});
```


An example on how to add, retrieve and delete a message on AWS SQS

```js
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
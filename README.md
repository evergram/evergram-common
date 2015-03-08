# evergram-common
Common code to be shared amongst node applications



```js

A demo on how to find and save printable posts from a user.

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
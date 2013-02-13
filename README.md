Passport strategy for SSO with Windows Azure
=====================

## Install

```
$ npm install passport-azure-store
```

## Usage

#### Configure Strategy

The Windows Azure Store authentication strategy authenticates users using a SSO token (SHA signed string with a secret) coming from Windows Azure.  The strategy requires a `verify` callback.

For more info read: <https://github.com/WindowsAzure/azure-resource-provider-sdk/blob/master/docs/api-sso.md>

    passport.use(new AzureStoreStrategy({
      secret: 'shhhhh',
      check_expiration: true
    }, function(req, azureInfo, done) {
      var user_id = azureInfo.subscription_id + '_' + azureInfo.cloud_service_name + '_' + azureInfo.resource_name; // you can do anything with this data, typically you would have to find the user based on this data somehow
      // lookup in DB
      done(bull, user);
    });

#### Authenticate Requests

Then in your app do something like this:

    app.get('/azure/sso',
      passport.authenticate('azure-store'),
      function(req, res) {
        ...
      }

## Credits

  - [Matias Woloski](http://github.com/woloski) by [Auth0](http://auth0.com)

## License

MIT
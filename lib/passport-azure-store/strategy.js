var passport = require('passport')
  , crypto = require('crypto')
  , moment = require('moment')
  , util = require('util');

function AzureStoreStrategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }

  this.options = options;
  this.options.check_expiration = options.check_expiration || true;
  
  if (!verify) throw new Error('AzureStore authentication strategy requires a verify function');
  if (!options.secret) throw new Error('Specify a secret string to create a hash');

  passport.Strategy.call(this);
  this.name = 'azure-store';
  this._verify = verify;
}

util.inherits(AzureStoreStrategy, passport.Strategy);

AzureStoreStrategy.prototype.authenticate = function(req) {
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  var azureRequest = {
    subscription_id: req.query['subid'],
    cloud_service_name: req.query['cloudservicename'],
    resource_type: req.query['resourcetype'],
    resource_name: req.query['resourcename']
  };
  
  var toSign = azureRequest.subscription_id + ':' +
          azureRequest.cloud_service_name + ':' +
          azureRequest.resource_type + ':' +
          azureRequest.resource_name + ':' +
          this.options.secret;

  var token = crypto.createHash("sha256").update(toSign).digest("hex");

  if (token !== req.query['token'])
    return self.error(new Error('token does not match, original: ' + req.query['token'] + ' new: ' + token));

  var delta = moment() - moment(req.query['timestamp']);
  if (this.options.check_expiration && delta > 10 * 60 * 1000) // 10 minutes
    return self.error(new Error('token expired'));

  this._verify(req, azureRequest, verified);
};

module.exports = AzureStoreStrategy;

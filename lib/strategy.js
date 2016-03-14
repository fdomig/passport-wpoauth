'use strict';

/**
 * Module dependencies.
 */
var util = require('util'),
  OAuth2Strategy = require('passport-oauth2'),
  Profile = require('./profile'),
  InternalOAuthError = require('passport-oauth2').InternalOAuthError;

// Polyfills
require('string.prototype.endswith');

/**
 * `Strategy` constructor.
 *
 * The WP-OAuth authentication strategy authenticates requests by delegating
 * to the configured WP-OAuth Server using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and the service-specific `profile`, an then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid. If an exception/error occured, `err` is set.
 *
 * Options:
 *  - `clientID`      the Client ID you created in WP-OAuth
 *  - `clientSecret`  the corresponding Client Secret
 *  - `callbackURL`   URL to which WP-OAuth will redirect the user after granting authorization.
 *
 *  - `authorizationURL`  the URL to the authorization endpoint, defaults to localhost.
 *  - `tokenURL`          the URL to get token endpoint, defaults to localhost.
 *  - `userProfileURL`    the URL to the profile information endpoint, defaults to localhost.
 *
 * Examples:
 *
 *  passport.use(new WPOAuthStrategy({
 *    clientID: '123abc456def789ghi',
 *    clientSecret: 'shhh-its-a-secret',
 *    callbackURL: 'https://www.example.net/auth/wpoauth/callback',
 *    authorizationURL: 'https://www.example.net/blog/oauth/authorize',
 *    tokenURL: 'https://www.example.net/blog/oauth/token',
 *    userProfileURL: 'https://www.example.net/blog/oauth/me'
 *  }, function(accessToken, refreshToken, profile, done) {
 *    User.findOrCreate(..., function(err, user) {
 *      ...
 *      done(err, user);
 *    });
 *  }
 *  ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'http://localhost/oauth/authorize';
  options.tokenURL = options.tokenURL || 'http://localhost/oauth/token';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-wpoauth';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'wpoauth';
  this._userProfileURL = options.userProfileURL || 'http://localhost/oauth/me/';

  // Otherwise we get a 301 which unforutunaly not handled by http/https
  if (!this._userProfileURL.endsWith('/')) {
    this._userProfileURL = this._userProfileURL + '/';
  }
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 *
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var self = this;

  if (req.query && req.query.error) {
    return self.fail();
  }

  if (!req.body) {
    return self.fail();
  }

  if (!req.body.redirectUri) {
    return self.fail('You need to provide a redirectUri');
  } else {
    self._callbackURL = req.body.redirectUri;
  }

  var authCode =  req.body.code || req.query.code;

  if (!authCode) {
    return self.fail();
  }

  self._exchangeAuthCode(authCode,
    function(error, accessToken, refreshToken, results) {
      if (error) {
        return self.fail(error);
      }

      self.userProfile(accessToken, function(err, profile) {
        if (err) {
          return self.fail(err);
        }

        var verified = function(e, user, info) {
          if (e) {
            return self.error(e);
          }
          if (!user) {
            return self.fail(info);
          }

          self.success(user, info);
        };

        if (self._passReqToCallback) {
          self._verify(req, accessToken, refreshToken, profile, verified);
        } else {
          self._verify(accessToken, refreshToken, profile, verified);
        }
      });
    });
};


/**
 * Exchange authorization code for tokens
 *
 * @param {String} authCode
 * @param {Function} done
 * @api private
 */
Strategy.prototype._exchangeAuthCode = function(authCode, done) {
  var params = {
    'grant_type': 'authorization_code',
    'redirect_uri': this._callbackURL
  };
  this._oauth2.getOAuthAccessToken(authCode, params, done);
};


/**
 * Retrive user profile from WP OAuth.
 *
 * This function constructs a normalized profile with the following properties:
 *
 *   - `provider`       always set to `wpoauth`
 *   - `id`             the user's WordPress ID
 *   - `username`       the user's login name
 *   - `displayName`    the user's preferred identification (can be username or full name or both)
 *   - `emails`         the user's email address
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function(err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(ex);
    }

    var profile = Profile.parse(json);
    profile.provider = 'wpoauth';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;

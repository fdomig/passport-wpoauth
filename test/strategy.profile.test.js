/* global describe, it, expect, before */
/* eslint expr: true */

var WPOAuthStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {
  describe('loading profile', function() {
    var profile;
    var strategy = new WPOAuthStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {
      });

    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'http://localhost/oauth/me/') {
        return callback(new Error('wrong url argument'));
      }
      if (accessToken != 'token') {
        return callback(new Error('wrong token argument'));
      }

      var body = '{"ID":"1","user_login":"anonymous","user_nicename":"anonymous","user_email":"anonymous@anonmail.org","user_registered":"2015-01-01 13:37:59","user_status":"0","display_name":"Anon Ymous","email":"anonymous@anonmail.org"}';

      callback(null, body, undefined);
    };

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) {
          return done(err);
        }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('wpoauth');

      expect(profile.id).to.equal('1');
      expect(profile.username).to.equal('anonymous');
      expect(profile.displayName).to.equal('Anon Ymous');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('anonymous@anonmail.org');
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });

  describe('loading invalid profile', function() {
    var invalidStrategy = new WPOAuthStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {
      });

    // mock
    invalidStrategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'http://localhost/oauth/me/') {
        return callback(new Error('wrong url argument'));
      }
      if (accessToken != 'token') {
        return callback(new Error('wrong token argument'));
      }

      var body = '{"ID":"1","user_login":"anonymous","user_nicename":"anonymous",...';

      callback(null, body, undefined);
    };

    var error;

    before(function(done) {
      invalidStrategy.userProfile('token', function(err, p) {
        if (err) {
          error = err;
          return done();
        }
      });
    });

    it('call the callback with an error object', function() {
      expect(error).to.not.be.undefined;
      expect(error.name).to.equal('SyntaxError');
      expect(error.message).to.equal('Unexpected token .');
    });
  });

  describe('encountering an error', function() {
    var err, profile;
    var strategy = new WPOAuthStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {
      });

    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'http://localhost/oauth/me/') {
        return callback(new Error('wrong url argument'));
      }
      if (accessToken != 'token') {
        return callback(new Error('wrong token argument'));
      }

      var body = '{"ID":"1","user_login":"anonymous","user_nicename":"anonymous","user_email":"anonymous@anonmail.org","user_registered":"2015-01-01 13:37:59","user_status":"0","display_name":"Anon Ymous","email":"anonymous@anonmail.org"}';

      callback(null, body, undefined);
    };

    before(function(done) {
      strategy.userProfile('wrong-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });

    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });

  describe('invalid calls', function() {

    it('without options', function(done) {
      try {
        new WPOAuthStrategy(null, function() { });
      } catch(err) {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.constructor.name).to.equal('TypeError');
        expect(err.message).to.equal('OAuth2Strategy requires a clientID option');
        done();
      }
    });
  });
});
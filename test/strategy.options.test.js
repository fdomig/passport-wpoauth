'use strict';
/* global describe, it, expect, before */
/* eslint expr: true */

var WPOAuthStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {

  describe('loading profile using custom URL', function() {
    var strategy =  new WPOAuthStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret',
        userProfileURL: 'https://wpoauth.onion/subfolder/blog/oauth/me'
      },
      function() {});

    // mock
    strategy._oauth2.get = function(url, accessToken, callback) {
      if (url != 'https://wpoauth.onion/subfolder/blog/oauth/me/') { return callback(new Error('wrong url argument')); }
      if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

      var body = '{"ID":"1","user_login":"anonymous","user_nicename":"anonymous","user_email":"anonymous@anonmail.org","user_registered":"2015-01-01 13:37:59","user_status":"0","display_name":"Anon Ymous","email":"anonymous@anonmail.org"}';

      callback(null, body, undefined);
    };


    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
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

});

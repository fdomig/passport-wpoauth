'use strict';
/* eslint-env node, mocha, jasmine */

var WPOAuthStrategy = require('../lib/strategy');


describe('Strategy#authenticate', function() {
  describe('authenticate', function() {

  });

  describe('exchange auth code', function() {
    var err, accessToken, refreshToken;
    var strategy = new WPOAuthStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {
    });

    // mock
    strategy._oauth2.getOAuthAccessToken = function(authCode, params, callback) {
      expect(params).to.not.be.undefined;
      expect(params).to.include.keys('grant_type');
      expect(params).to.have.property('grant_type', 'authorization_code');
      callback(null, 'access_token', 'refresh_token');
    };

    before(function(done) {
      strategy._exchangeAuthCode('authCode', function(e, aToken, rToken) {
        err = e;
        accessToken = aToken;
        refreshToken = rToken;
        done();
      });
    });

    it('should not error', function() {
      expect(err).to.be.null;
    });

    it('should have a grant_type', function() {
      expect(accessToken).to.not.be.undefined;
      expect(refreshToken).to.not.be.undefined;

      expect(accessToken).to.equal('access_token');
      expect(refreshToken).to.equal('refresh_token');
    });
  });
});

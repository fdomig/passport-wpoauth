/* eslint expr: true */

var WPOAuthStrategy = require('../lib/strategy');


describe('Strategy#authenticate', function() {
  describe('authenticate', function() {

  });

  describe('exchange auth code', function() {
    var err, params;
    var strategy = new WPOAuthStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {
      });

    // mock
    strategy._oauth2.getOAuthAccessToken = function(authCode, params, callback) {
      callback(authCode, params);
    };

    before(function(done) {
      strategy._exchangeAuthCode('authCode', function(e, p) {
        err = e;
        params = p;
        done();
      });
    });

    it('should not error', function() {
      expect(err).to.be.null;
    });

    it('should have a grant_type', function() {
      expect(params).to.not.be.undefined;
      expect(params).to.have.property('grant_type');
      expect(params).to.have.propertyVal('grant_type', 'authorization_code');
    });
  });
});

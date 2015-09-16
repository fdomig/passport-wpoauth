/* global describe, it, expect, before */
/* eslint expr: true */

var fs = require('fs')
  , parse = require('../lib/profile').parse;


describe('profile.parse', function() {

  describe('example profile', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/data/example.json', 'utf8', function(err, data) {
        if (err) {
          return done(err);
        }
        profile = parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('1');
      expect(profile.username).to.equal('anonymous');
      expect(profile.displayName).to.equal('Anon Ymous');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('anonymous@anonmail.org');
    });
  });

  describe('example profile with hasn\'t a full name', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/data/example-displayname-eq-username.json', 'utf8',
        function(err, data) {
          if (err) {
            return done(err);
          }
          profile = parse(data);
          done();
        });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('1');
      expect(profile.username).to.equal('anonymous');
      expect(profile.displayName).to.equal('anonymous');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('anonymous@anonmail.org');
    });
  });

  describe('invalid json', function() {
    var error;

    before(function(done) {
      fs.readFile('test/data/invalid.json', 'utf8',
        function(err, data) {
          if (err) {
            return done(err);
          }
          try {
            parse(data);
          } catch(ex) {
            error = ex;
          }
          done();
        });
    });

    it('should throw an error', function() {
      expect(error).to.not.be.undefined;
      expect(error.name).to.equal('SyntaxError');
      expect(error.message).to.equal('Unexpected token /');
    });
  });
});
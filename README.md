# passport-wpoauth
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Code Climate][climate-image]][climate-url] [![Coverage Status][coveralls-image]][coveralls-url]

A authentication strategy for [Passport](http://passportjs.org/) against a 
[Wordpress OAuth Server](https://wp-oauth.com/).

## Install

```bash
$ npm install --save passport-wpoauth
```


## Usage

```javascript
var passport =  require('passport'),
    WPOAuthStrategy = require('passport-wpoauth');
    
passport.use(new WPOAuthStrategy({
  clientID: '123abc456def789ghi',
  clientSecret: 'shhh-its-a-secret',
  callbackURL: 'https://www.example.net/auth/wpoauth/callback',
  authorizationURL: 'https://www.example.net/blog/oauth/authorize',
  tokenURL: 'https://www.example.net/blog/oauth/token',
  userProfileURL: 'https://www.example.net/blog/oauth/me'
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      ...
      done(err, user);
    });
  }
));
```


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [gulp](http://gulpjs.com/).

# Conspirators
A HUGE thanks to [Jared Hanson](https://github.com/jaredhanson), i used 
[`passport-github`](https://github.com/jaredhanson/passport-github) as a 
guideline.

## License
Copyright (c) 2015 Thomas Lercher. 
Licensed under the MIT license.

[npm-url]: https://npmjs.org/package/passport-wpoauth
[npm-image]: https://badge.fury.io/js/passport-wpoauth.svg
[travis-url]: https://travis-ci.org/tlercher/passport-wpoauth
[travis-image]: https://travis-ci.org/tlercher/passport-wpoauth.svg?branch=master
[daviddm-url]: https://david-dm.org/tlercher/passport-wpoauth.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/tlercher/passport-wpoauth
[climate-url]: https://codeclimate.com/github/tlercher/passport-wpoauth
[climate-image]: https://codeclimate.com/github/tlercher/passport-wpoauth/badges/gpa.svg
[coveralls-url]: https://coveralls.io/r/tlercher/passport-wpoauth
[coveralls-image]: https://coveralls.io/repos/tlercher/passport-wpoauth/badge.svg?branch=master&service=github

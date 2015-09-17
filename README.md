# passport-wpoauth
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Code Climate][climate-image]][climate-url] [![Dependency Status][daviddm-image]][daviddm-url]

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
[npm-image]: https://img.shields.io/npm/v/passport-wpoauth.svg?style=flat-square
[travis-url]: https://travis-ci.org/tlercher/passport-wpoauth
[travis-image]: https://img.shields.io/travis/tlercher/passport-wpoauth.svg?style=flat-square
[daviddm-url]: https://david-dm.org/tlercher/passport-wpoauth
[daviddm-image]: https://img.shields.io/david/tlercher/passport-wpoauth.svg?style=flat-square
[climate-url]: https://codeclimate.com/github/tlercher/passport-wpoauth
[climate-image]: https://img.shields.io/codeclimate/github/tlercher/passport-wpoauth.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/tlercher/passport-wpoauth
[coveralls-image]: https://img.shields.io/coveralls/tlercher/passport-wpoauth/master.svg?style=flat-square

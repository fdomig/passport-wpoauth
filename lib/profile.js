require('string.prototype.includes');

/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  var profile = {};
  profile.id = json.ID;

  profile.username = json.user_login;
  profile.displayName = json.display_name;

  if (json.display_name.includes(' ')) {
    var nameParts = json.display_name.split(' ');
    profile.name = {
      familyName: nameParts.pop(),
      givenName: nameParts.join(' ')
    };
  }

  profile.emails = [{value: json.user_email}];

  return profile;
};
const jwt = require('jsonwebtoken')

/**
 * 
 * @param {Object} user | result from a verified authentication strategy eg. LocalStategy
 * @param {Object} options | options for JWT Token refer to https://github.com/auth0/node-jsonwebtoken
 */

let issueToken = (user, config) => {
  let payload = {
    user: {
      id: user.id,
      username: user.username,
    }
  }

  options = config.option

  let token = jwt.sign(payload, config.secret, options);
  return token
}

module.exports = issueToken
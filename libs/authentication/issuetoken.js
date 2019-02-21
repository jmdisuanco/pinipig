const jwt = require('jsonwebtoken')

/**
 * 
 * @param {Object} user | result from a verified authentication strategy eg. LocalStategy
 * @param {Object} options | options for JWT Token refer to https://github.com/auth0/node-jsonwebtoken
 */

let issueToken = config => (user) => {
  let payload = {
    user: {
      id: user.id,
      username: user.username,
    }
  }

  options = config.jwt.option

  let token = jwt.sign(payload, config.jwt.secret, options);
  return token
}

module.exports = issueToken
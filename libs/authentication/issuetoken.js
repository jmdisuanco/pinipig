const jwt = require('jsonwebtoken')
const config = require('../config/default')
/**
 * 
 * @param {Object} user | result from a verified authentication strategy eg. LocalStategy
 * @param {Object} options | options for JWT Token refer to https://github.com/auth0/node-jsonwebtoken if no options will use default config file  
 */

let issueToken = (user, options = undefined) => {
  let payload = {
    user: {
      id: user.id,
      username: user.username,
    }
  }
  options == undefined ? options = config.jwt.option : null

  let token = jwt.sign(payload, config.jwt.secret, options);
  return token
}

module.exports = issueToken
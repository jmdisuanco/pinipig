const encryptPass = require('./encryptpassword')
const issueToken = require('./issuetoken')
const verify = require('./verify')
//default strategies
const local = require('./strategies/local')

module.exports = {
  encryptPass,
  issueToken,
  verify,
  strategy: {
    local
  }
}
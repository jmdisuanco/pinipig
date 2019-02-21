const bcrypt = require('bcrypt')
const issueToken = require('../issuetoken')

/**
 * Authenticate Login using Local Strategy
 * Output - jwt:{"TOKEN_STRING"}
 * @param {Object} ctx |  
 * Example Usage:
 * options = {
 *  Model: User
 * token:{
 *    
 * }
 * } 
 * let LocalStrategy = auth.strategy.local(options)
 *  
 */

let LocalStrategy = options => (ctx) => {
  let res = ctx.res
  let username = ctx.data.fields.username
  let password = ctx.data.fields.password
  options.Model.findOne({
    where: {
      username: username
    }
  }, (err, user) => {
    if (err) {
      console.log(err)
      res.end(JSON.stringify(err))
    }
    if (!user) {
      res.end(JSON.stringify(err))
    }
    bcrypt.compare(password, user.password, function (err, isValid) {
      if (isValid) {
        res.end(JSON.stringify({
          jwt: issueToken(user, options.jwt)
        }))
      } else {
        res.end(JSON.stringify({
          result: 'Unauthorized'
        }))
      }

    })
  })
}

module.exports = LocalStrategy
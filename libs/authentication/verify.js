const jwt = require('jsonwebtoken')

/**
 *
 * Partial function
 * @param {Object} ctx | context object from Pinipig App
 *Usage
 * let verifier = verify(config)
 * verifier(ctx) 
 */
let verify = config => async (ctx) => {
  let block = () => {
    ctx.res.end('{"result":"Unauthorized}"')
  }
  if (ctx.headers == undefined) {
    let token = ctx.req.headers['pinipig-jwt']
    try {
      let isValid = await jwt.verify(token, config.jwt.secret)
      if (isValid) {
        return ctx
      } else {
        block()
      }
    } catch (e) {
      block()
    }
  } else {
    block()
  }
}

module.exports = verify
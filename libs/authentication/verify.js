const jwt = require('jsonwebtoken')
const config = require('../config/default')
/**
 * 
 * @param {Object} ctx | context object from Pinipig App
 * 
 */
let verify = async (ctx) => {
  let block = () => {
    ctx.res.end('Unauthorized')
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
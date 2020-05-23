const jwt = require('jsonwebtoken')
/**
 * This will read pinpig-jwt stored on the header
 *
 * @param {Object} ctx
 * returns ctx.jwt
 *
 */
let init_getJWT = (ctx) => {
  try {
    ctx.jwt = ctx.req.getHeader('pinipig-jwt')
    return ctx
  } catch (e) {
    console.log(e)
    return ctx
  }
}

/**
 * This will verify the JWT
 * Partial Function
 * @param {Object} config //configuration file containing jwt secret key
 *
 * @param {Object} ctx
 * returns ctx.Authorized  Boolean
 * return  ctx.UserPayload  if authorized
 * UserPayload is the decoded token value
 */
let verify = (config) => async (ctx) => {
  try {
    let token = ctx.jwt
    let payload = await jwt.verify(token, config.secret)
    ctx.Authorized = true
    ctx.UserPayload = payload
    ctx.res.json({ authorized: true })
    return ctx
  } catch (e) {
    ctx.Authorized = false
    ctx.res.json({ authorized: false })
  }
}

let decode = (config) => async (ctx) => {
  try {
    let token = ctx.jwt
    let payload = await jwt.verify(token, config.secret)
    ctx.Authorized = true
    ctx.UserPayload = payload
    return ctx
  } catch (e) {
    ctx.Authorized = false
    ctx.res.json({ authorized: false })
    console.log(e)
    return false
  }
}

module.exports = {
  init_getJWT,
  verify,
  decode,
}

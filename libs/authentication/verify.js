const jwt = require('jsonwebtoken')

/**
 *
 * Partial function
 * @param {Object} ctx | context object from Pinipig App
 *Usage
 * let verifier = verify(config)
 * verifier(ctx) 
 */
let verify = config => async ctx => {
  let block = () => {
    ctx.res.json({result:"Unauthorized"})
    return
  }
  if (ctx.headers == undefined) {
    
    try {
      let token = ctx.req.getHeader('pinipig-jwt')
      let isValid = await jwt.verify(token, config.secret)
      if (isValid) {
        let tkn = jwt.decode(token)
        if(tkn.iss === config.option.issuer){
          ctx.token = tkn
          return ctx
        }else{
          block()
        }
        
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
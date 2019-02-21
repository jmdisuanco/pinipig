const bcrypt = require('bcrypt')

let encryptPass = (ctx) => {
  ctx.data.fields.password = bcrypt.hashSync(ctx.data.fields.password, 10)
  return ctx
}

module.exports = encryptPass
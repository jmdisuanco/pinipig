const streamFile = require('./streamfile')

const staticFileServer = (rootDir = 'public') => (ctx) => {
  const url = ctx.req.getUrl()
  let path = url.split('/')
  const isFile = path[path.length - 1].indexOf('.') !== -1 ? true : false
  if (isFile) path.pop()
  path = path.join('/')
  streamFile(rootDir + path)(ctx)
  return ctx
}
module.exports = staticFileServer

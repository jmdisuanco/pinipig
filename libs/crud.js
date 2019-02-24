const filter = require('./filter')
try {
  ObjectID = require('mongodb').ObjectID
} catch (e) {
  null
}

let read = model => (ctx) => {
  // console.log('reading...')

  let id
  try {
    //will work if adapter is MongoDB
    ObjectID.isValid(ctx.data.id) ? id = ObjectID(ctx.data.id) : id = parseInt(ctx.parameters.id)
  } catch (e) {
    id = parseInt(ctx.parameters.id)
  }
  model.find({
    where: {
      id: id
    }
  }, (err, data) => {
    if (err) {
      console.log(err)
      ctx.res.end('{"result":"error"}')
    }
    try {
      if (ctx.options != undefined) {
        if (ctx.options.filter != undefined) {
          filtered = filter(data, ctx.options.filter)
          ctx.res.end(JSON.stringify(filter))
        }
      }
    } catch (e) {
      ctx.res.end(JSON.stringify(data))
    }
  })
}

let readList = model => async (ctx) => {
  // console.log('listing...')
  let urlQuery = ctx.query
  let query = {}
  let count = 0

  if (urlQuery) {
    urlQuery.limit != undefined ? query.limit = parseInt(urlQuery.limit) : query.limit = 100
    urlQuery.skip != undefined ? query.skip = parseInt(urlQuery.skip) : query.skip = 0
    urlQuery.order != undefined ? query.order = urlQuery.order : null
  }
  // console.log(query)
  model.all(query, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    model.count({}, (err, c) => {
      let count = c
      let prettify = null
      if (ctx.query != undefined) {
        ctx.query.pretty == 'true' ? prettify = 2 : null
      }
      try {
        if (ctx.options != undefined) {
          if (ctx.options.filter != undefined) {
            filtered = filter(data, ctx.options.filter)
          }
        }
        ctx.res.end(JSON.stringify({
          count: count,
          limit: query.limit,
          skip: query.skip,
          data: filtered || data
        }, null, prettify))
      } catch (e) {
        console.log(e.message)
        return false
      }
    })
  })
}

let create = model => (ctx) => {
  // console.log('creating...')
  model.create(ctx.data.fields, (err, data) => {
    if (err) {
      ctx.res.end(JSON.stringify(err))
    }
    try {
      ctx.res.end(JSON.stringify({
        result: 'created',
        data: data
      }))
    } catch (e) {
      return false
    }

  })

}

let update = model => (ctx) => {
  try {
    //will work if adapter is MongoDB
    ObjectID.isValid(ctx.data.id) ? id = ObjectID(ctx.data.id) : id = parseInt(ctx.parameters.id)
  } catch (e) {
    id = parseInt(ctx.parameters.id)
  }
  model.exists(id, (err, exists) => {
    if (exists) {
      model.updateOrCreate({
        id: id
      }, ctx.data.fields, (err, result) => {
        ctx.res.end(JSON.stringify({
          result: 'updated',
          id: id
        }))
      })
    }
  })
}

let destroy = model => (ctx) => {
  // console.log('detroying...')
  try {
    //will work if adapter is MongoDB
    ObjectID.isValid(ctx.data.id) ? id = ObjectID(ctx.data.id) : id = parseInt(ctx.parameters.id)
  } catch (e) {
    id = parseInt(ctx.parameters.id)
  }
  model.destroyById(id, (err, result) => {
    ctx.res.end(JSON.stringify({
      result: 'deleted',
      id: id
    }))
  })
}

let count = model => (ctx) => {
  model.count({}, (err, c) => {
    ctx.res.end(JSON.stringify({
      count: c
    }))
  })
}

module.exports = {
  create,
  read,
  readList,
  update,
  destroy, // delete
  count
}
const { filterProcess } = require('./filter')
try {
  ObjectID = require('mongodb').ObjectID
} catch (e) {
  null
}

let read = (model) => async (ctx) => {
  if(!ctx) return
  let filtered
  let prettify = null
  if (ctx.query != undefined) {
    ctx.query.pretty == 'true' ? (prettify = true) : (prettify = false)
  }
  //console.log('reading...')
  let id
  try {
    //will work if adapter is MongoDB
    ObjectID.isValid(ctx.parameters.id)
      ? (id = ObjectID(ctx.parameters.id))
      : (id = parseInt(ctx.parameters.id))
  } catch (e) {
    id = parseInt(ctx.parameters.id)
  }
  let result = await model.findOne(
    {
      where: {
        id: id,
      },
    },
    (err, data) => {
      if (ctx.options != undefined) {
        if (ctx.options.filter != undefined) {
          filtered = filterProcess(data, ctx.options.filter)
        }
      }
      // ctx.res.end(JSON.stringify({
      //   data: filtered || data
      // }, null, prettify))
      let result = {
        data: filtered || data,
      }

      if (err) {
        // console.log(err)
        //ctx.res.end('{"result":"error"}')
        ctx.res.json({
          result: 'error',
        })
        return result
      } else {
        ctx.res.json(result, prettify)
        return result
      }
    }
  )
  Object.assign(ctx, { crud: { result } })
  return ctx
}

let readList = (model) => async (ctx) => {
  if(!ctx) return
  // console.log('listing...')
  let urlQuery = ctx.query
  let query = {}
  let count = 0

  if (urlQuery) {
    urlQuery.limit != undefined
      ? (query.limit = parseInt(urlQuery.limit))
      : (query.limit = 100)
    urlQuery.skip != undefined
      ? (query.skip = parseInt(urlQuery.skip))
      : (query.skip = 0)
    urlQuery.order != undefined ? (query.order = urlQuery.order) : null
  }
  // console.log(query)
  model.all(query, (err, data) => {
    let filtered
    if (err) {
      console.log(err)
      return
    }
    model.count({}, (err, c) => {
      let count = c
      let prettify = null
      if (ctx.query != undefined) {
        ctx.query.pretty == 'true' ? (prettify = 2) : null
      }

      if (ctx.options != undefined) {
        if (ctx.options.filter != undefined) {
          filtered = filterProcess(data, ctx.options.filter)
        }
      }

      let result = {
        count: count,
        limit: query.limit,
        skip: query.skip,
        data: filtered || data,
      }
      ctx.res.json(result, prettify)
    })
  })
  Object.assign(ctx, { crud: { result: 'success' } })
  return ctx
}

let create = (model) => async (ctx) => {
  if(!ctx) return
  // console.log('creating...')
  let result = await model.create(ctx.data.fields, (err, data) => {
    if (err) {
      ctx.res.end(JSON.stringify(err))
    }
    try {
      // ctx.res.end(JSON.stringify({
      //   result: 'created',
      //   data: data
      // }))
      let response = {
        result: 'created',
        data: data,
      }
      ctx.res.json(response)
    } catch (e) {
      return false
    }
  })

  Object.assign(ctx, { crud: { result } })
  return ctx
}

let update = (model) => (ctx) => {
  if(!ctx) return
  try {
    //will work if adapter is MongoDB
    ObjectID.isValid(ctx.parameters.id)
      ? (id = ObjectID(ctx.parameters.id))
      : (id = parseInt(ctx.parameters.id))
  } catch (e) {
    // console.log(e)
    id = parseInt(ctx.parameters.id)
  }
  model.exists(id, (err, exists) => {
    if (exists && typeof ctx.data.fields === 'object') {
      model.update(
        {
          _id: id,
        },
        ctx.data.fields,
        (err, result) => {
          if (err) {
            console.log(err.message)
          } else {
            // ctx.res.end(JSON.stringify({
            //   result: 'updated',
            //   id: id
            // }))
            let response = {
              result: 'updated',
              id: id,
            }
            ctx.res.json(response)
          }
        }
      )
    } else {
      ctx.res.end('{"result": "No Document found"}')
    }
  })
  return ctx
}

let destroy = (model) => (ctx) => {
  if(!ctx) return
  // console.log('detroying...')
  try {
    //will work if adapter is MongoDB
    ObjectID.isValid(ctx.parameters.id)
      ? (id = ObjectID(ctx.parameters.id))
      : (id = parseInt(ctx.parameters.id))
  } catch (e) {
    id = parseInt(ctx.parameters.id)
  }
  model.destroyById(id, (err, result) => {
    // ctx.res.end(JSON.stringify({
    //   result: 'deleted',
    //   id: id
    // }))

    let response = {
      result: 'deleted',
      id: id,
    }
    ctx.res.json(response)
  })
  return ctx
}

let count = (model) => (ctx) => {
  model.count({}, (err, c) => {
    ctx.res.end(
      JSON.stringify({
        count: c,
      })
    )
  })
  return ctx
}

module.exports = {
  create,
  read,
  readList,
  update,
  destroy, // delete
  count,
}

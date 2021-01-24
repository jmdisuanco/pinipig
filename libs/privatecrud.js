const { filterProcess } = require('./filter')
try {
  ObjectID = require('mongodb').ObjectID
} catch (e) {
  null
}

let privateRead = (model) => (ctx) => {
  ctx.res.onAborted(() => {
    console.log('read request Aborted')
    return false
  })
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
  model.findOne(
    {
      where: {
        id: id,
        ownerid: ctx.UserPayload.user.id,
      },
    },
    async (err, data) => {
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
      ctx.res.json(result, prettify)

      Object.assign(ctx, { crud: result })

      return ctx

      if (err) {
        console.log(err)
        //ctx.res.end('{"result":"error"}')
        ctx.res.json({
          result: 'error',
        })
      }
    }
  )
}

let privateReadList = (model) => async (ctx) => {
  ctx.res.onAborted(() => {
    console.log('readlist request Aborted')
    return false
  })
  // console.log('listing...')
  let urlQuery = ctx.query
  let query = { where: { ownerid: ctx.UserPayload.user.id } }
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
      console.log('privateCRUD: ', err.message)
      return
    }
    model.count({ where: { ownerid: ctx.UserPayload.user.id } }, (err, c) => {
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
      // ctx.res.end(JSON.stringify({
      //   count: count,
      //   limit: query.limit,
      //   skip: query.skip,
      //   data: filtered || data
      // }, null, prettify))
      let result = {
        count: count,
        limit: query.limit,
        skip: query.skip,
        data: filtered || data,
      }
      ctx.res.json(result, prettify)
      return ctx
    })
  })
}

let privateCreate = (model) => async (ctx) => {
  ctx.res.onAborted(() => {
    console.log('create request Aborted')
    return false
  })
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

  ctx.result = result
  return ctx
}

let privateUpdate = (model) => async (ctx) => {
  try {
    const { res } = ctx
    ctx.res.onAborted(() => {
      res.json({ error: 'request aborted' })
      console.log('update request Aborted')
      return false
    })
    try {
      //will work if adapter is MongoDB
      ObjectID.isValid(ctx.parameters.id)
        ? (id = ObjectID(ctx.parameters.id))
        : (id = parseInt(ctx.parameters.id))
    } catch (e) {
      console.log(e)
      id = parseInt(ctx.parameters.id)
    }
    model.exists(id, (err, exists) => {
      if (exists && typeof ctx.data.fields === 'object') {
        try {
          model.update(
            {
              _id: id,
              ownerid: ctx.UserPayload.user.id,
            },
            ctx.data.fields,

            (err, result) => {
              if (err) {
                console.log(err.message)
              } else {
                let response = {
                  result: 'updated',
                  id: id,
                }

                res.json(response)
              }
            }
          )
        } catch (e) {
          console.log('privatecrud:update', e.message)
        }
      } else {
        ctx.res.end('{"result": "No Document found"}')
      }
    })
    //retrieve updated data
    try {
      let result = await model.findOne({ where: { id: id } })
      //ctx.result = result
      Object.assign(ctx, { crud: result })
      return ctx
    } catch (e) {
      console.log('privatecrud:update:findone', e.message)
    }
  } catch (e) {
    console.log(e.message)
    return false
  }
}

let privateDestroy = (model) => (ctx) => {
  ctx.res.onAborted(() => {
    console.log('destroy request Aborted')
    return false
  })
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
    return ctx
  })
}

let privateCount = (model) => (ctx) => {
  model.count({ where: { ownerid: ctx.UserPayload.user.id } }, (err, c) => {
    ctx.res.end(
      JSON.stringify({
        count: c,
      })
    )
  })
}

module.exports = {
  privateCreate,
  privateRead,
  privateReadList,
  privateUpdate,
  privateDestroy, // delete
  privateCount,
}

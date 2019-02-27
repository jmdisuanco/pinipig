/**
 * Test Server
 * 
 */
const config = require('./default.json')
const pinipig = require("../pinipig.js")
const crud = pinipig.crud
const path = require('path')
const fs = require('fs')
const orm = pinipig.orm
const auth = pinipig.auth

const {
  filter
} = require('../libs/filter')

let {
  cors,
  preFlight
} = pinipig.utils;

let {
  streamFile
} = pinipig
let sf = streamFile('./test/public')

//Initialize ORM
let dbconf = {
  driver: 'tingodb',
  database: './test/data/db'
}

let mongoconf = {
  driver: 'mongodb',
  database: 'test'
}


let ORM = orm.Schema
let schema = new ORM(dbconf.driver, dbconf)
let mongoSchema = new ORM(mongoconf.driver, mongoconf)

//Create Model
let Test = schema.define('Test', {
  title: {
    type: schema.String
  },
  content: {
    type: schema.String
  },
  hidden: {
    type: schema.String
  }
})

//Create Model

let Mongo = mongoSchema.define('MongoTest', {
  title: {
    type: mongoSchema.String
  },
  content: {
    type: mongoSchema.String
  },
  hidden: {
    type: mongoSchema.String
  }
})


let User = schema.define('User', {
  username: {
    type: schema.String
  },
  password: {
    type: schema.String
  }
})

let stratOption = {
  Model: User,
  config: config.jwt
}

const localStrategy = auth.strategy.local(stratOption)
let uC = crud.create(User)
let uR = crud.read(User)
let uL = crud.readList(User) //List
let uU = crud.update(User)
let uD = crud.destroy(User) //destroy coz 'delete' is a reserved word
let ucount = crud.count(User)



//initialize CRUD
let C = crud.create(Test)
let R = crud.read(Test)
let L = crud.readList(Test) //List
let U = crud.update(Test)
let D = crud.destroy(Test) //destroy coz 'delete' is a reserved word
let count = crud.count(Test)


//initialize CRUD for Mongo
let mC = crud.create(Mongo)
let mR = crud.read(Mongo)
let mL = crud.readList(Mongo) //List
let mU = crud.update(Mongo)
let mD = crud.destroy(Mongo) //destroy coz 'delete' is a reserved word
let mcount = crud.count(Mongo)

//Methods

let init_getHead = (ctx) => {
  try {
    ctx.headers = []
    console.log(ctx.req.getHeader('pinipig-jwt'))
    ctx.headers.push(['pinipig-jwt', ctx.req.getHeader('pinipig-jwt')])
    return ctx
  } catch (e) {
    console.log(e)
  }
}

let getMethod = (ctx) => {
  const {
    res,
    req
  } = ctx
  try {
    res.onAborted = () => {
      res.end()
    }
    let method = JSON.stringify(req.getMethod())

  } catch (e) {
    console.log(req.getMethod(), e.message)
    res.end()
    result
  }
}

let HelloWorld = function (ctx) {
  try {
    ctx.res.writeHead(200, {
      "accept": "*",
      "content-type": "text/html"
    });
    ctx.res.end("Hello World");
  } catch (e) {
    ctx.res.end();
  }
}

let Param = ctx => {
  try {
    ctx.res.writeHead(200, {
      accept: "*",
      "content-type": "text/html"
    });
    ctx.res.write(ctx.parameters.name); //write a response to the client
    ctx.res.end(); //end the response
  } catch (e) {
    console.log(e)
  }

}

let getQuery = ctx => {
  ctx.res.json(ctx.query)
}

let Combi = ctx => {
  let {
    query,
    parameters,
    res
  } = ctx
  let result = {
    query,
    parameters
  }
  res.json(result)

}

let tellURL = ctx => {
  try {
    let url = ctx.req.getUrl()
    ctx.res.end(url)
  } catch (e) {

  }
}
let FormProcess = ctx => {
  try {
    try {
      ctx.data.files.map(f => {
        let target = path.join('./examples/uploads/', f.filename)
        fs.rename(f.tmpFilename, target, function (err) {
          if (err) return
          console.log(`written ${target}`)
        })
      })
    } catch (e) {
      console.log('no files to process')
    }

    ctx.res.json(ctx.data)

  } catch (e) {
    ctx.res.end()
    console.log(e);
  }
}

let UploadForm = context => {
  try {
    context.res.writeHeader("content-type", "text/html");
    context.res.write(
      '<form action="/upload" enctype="multipart/form-data" method="post">' +
      '<input type="text" name="title"/><br>' +
      '<input type="file" name="upload" multiple="multiple"><br>' +
      '<input type="submit" value="Upload">' +
      "</form>"
    );
    context.res.end()
  } catch (e) {
    console.log(e);
  }
};

let WSPost = (ctx) => {
  ctx.ws.send(`Connected via ${ctx.req.getUrl()}`)
}
let WSMessage = (ctx) => {
  let ok = ctx.ws.send(ctx.message, ctx.isBinary)

}


let routes = [
  //Basic  Test
  {
    url: "/",
    get: HelloWorld
  },
  {
    url: "/user/:name", // http://localhost:9090/user/[NAME]
    get: Param,
  },
  // URL Query TEST
  {
    url: "/query",
    get: getQuery
  },
  {
    url: "/combi/:name",
    get: Combi
  },

  {
    url: "/a/:b",
    get: tellURL,
  },
  {
    url: "/a/b/c",
    get: tellURL,
  },

  {
    url: "/a/b",
    get: tellURL,
  },
  {
    url: "/a",
    get: tellURL,
  },
  {
    url: "/post",
    post: FormProcess,
    ws: {
      options: {
        compression: 0,
        maxPayloadLength: 16 * 1024 * 1024,
        idleTimeout: 3000
      },
      open: WSPost,
      message: WSMessage,
      drain: null,
      close: null
    }
  },
  {
    url: "/upload",
    get: UploadForm,
    post: FormProcess
  },
  {
    url: '/method',
    get: getMethod,
    post: getMethod,
    patch: getMethod
  },
  {
    url: '/public/*',
    get: sf
  },
  //CRUD TEST
  {
    url: '/crud',
    get: [filter(['hidden']), L],
    post: C,
  },
  {
    url: '/crud/:id',
    get: [filter(['hidden']), R],
    patch: U,
    put: U,
    del: D
  },
  {
    url: '/crud/count',
    get: count
  },

  //MongoCrud
  //CRUD TEST
  {
    url: '/mongo',
    get: [filter(['hidden']), mL],
    post: mC,
  },
  {
    url: '/mongo/:id',
    get: [filter(['hidden']), mR],
    patch: mU,
    put: mU,
    del: mD
  },
  {
    url: '/mongo/count',
    get: mcount
  },
  //Authentication Test
  {
    url: '/user',
    get: [filter(['password']), uL],
    post: [auth.encryptPass, uC]
  },
  {
    url: '/auth',
    post: localStrategy
  }
]

let options = {
  port: 9090,
  routes: routes,
  banner: `Pinipig Test Server 9090`
}

pinipig.createServer(options)
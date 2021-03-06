# Examples

- ## Simple Hooks usage Example

```javascript
/**
 * This is an example with Hooks
 * and taking advantage of pinipig's REST handler
 *
 */

const pinipig = require('pinipig')

let HelloWorld = function(ctx) {
  ctx.res.setHeader('Content-Type', 'text/html')
  ctx.res.writeHead(200, {
    'Content-Type': 'text/html',
  })
  ctx.res.write('Working') //write a response to the client
  ctx.res.end() //end the response
}

let Query = ctx => {
  ctx.res.setHeader('Content-Type', 'text/html')
  ctx.res.writeHead(200, {
    'Content-Type': 'text/html',
  })
  ctx.res.write(`<H1> ${ctx.data.num} + 1 =  ${ctx.data.total}</H1>`) //iuput the processed data
  ctx.res.end() //end the response
  return ctx
}

let addOne = ctx => {
  ctx.data.total = parseInt(ctx.data.num) + 1
  return ctx
}

let sytemOut = ctx => {
  console.log(ctx.data) //console log to the system
}
let routes = [
  {
    url: '/',
    GET: HelloWorld,
  },
  {
    url: '/add/:num', // http://localhost:9090/add/[Number]
    GET: Query,
    hooks: {
      before: addOne,
      after: sytemOut, //console log to the system
    },
  },
]

let options = {
  port: 9090,
  routes: routes,
}

pinipig.createServer(options)
```

---

- ## File Upload handling example

```javascript
/**
 * This is a example of handling upload in Pinipig server
 *
 *  -- > Make sure you created uploads folder in your App root. < --
 */

const pinipig = require('pinipig')

let UploadForm = context => {
  context.res.writeHead(200, {
    'content-type': 'text/html',
  })
  context.res.write(
    '<form action="/upload" enctype="multipart/form-data" method="post">' +
      '<input type="text" name="title"/><br>' +
      '<input type="file" name="upload" multiple="multiple"><br>' +
      '<input type="submit" value="Upload">' +
      '</form>'
  )
  context.res.end()
  return context.res.end()
}

let UploadFormProcess = context => {
  let data = context.data
  let tmpPath = data.files.upload.path
  let newPath = './examples/uploads/' + data.files.upload.name //Make sure you created uploads folder in your App root.
  fs.rename(tmpPath, newPath, function(err) {
    if (err) throw err
    context.res.write('File uploaded with title ' + data.fields.title + '!')
    context.res.end()
  })
}

let routes = [
  {
    url: '/',
    GET: UploadForm,
  },
  {
    url: '/upload',
    POST: UploadFormProcess,
  },
]

let options = {
  port: 9090,
  routes: routes,
}

pinipig.createServer(options)
```

---

- ## CORS example

```javascript
const pinipig = require('pinipig')

let { cors, preFlight } = pinipig.utils
let HelloWorld = function(ctx) {
  ctx.res.setHeader('Content-Type', 'text/html')
  ctx.res.writeHead(200, {
    'Content-Type': 'text/html',
  })
  ctx.res.write('Working') //write a response to the client
  ctx.res.end() //end the response
}

let Query = ctx => {
  cors(ctx.res)
  ctx.res.setHeader('Content-Type', 'text/html')
  ctx.res.writeHead(200, {
    'Content-Type': 'text/html',
  })
  ctx.res.write('<H1>Hello ' + ctx.data.name + '</H1>') //write a response to the client
  ctx.res.end() //end the response
}

let routes = [
  {
    url: '/',
    GET: HelloWorld,
  },
  {
    url: '/user/:name', // http://localhost:9090/user/[NAME]
    GET: Query,
    OPTIONS: preFlight, // Preflight check by browser
  },
]

let options = {
  port: 9090,
  routes: routes,
}

pinipig.createServer(options)
```

- ## Websocket Example

```javascript
const pinipig = require("../pinipig.js")



let Handshake = (ctx) => {
    ctx.ws.send(`Connected via url${ctx.req.getUrl()}`)
}
let WSMessage = (ctx) => {
    try{
      console.log(ctx.ws.getRemoteAddress())

        let  data = Buffer.from(ctx.message).toString("binary")
        console.log(data.toUpperCase())
         let ok = ctx.ws.send(data.toUpperCase(), ctx.isBinary)
    }
  catch(e){
    console.log(e)
  }
}


let routes = [
    {
        url: "/ws", // ws://localhost:9090/ws
        ws: {
            options: {
                compression: 0,
                maxPayloadLength: 16 * 1024 * 1024,
                idleTimeout: 10
            },
            open: Handshake,
            message: WSMessage,
            drain: null,
            close: null
        }
    }

];

let options = {
    port: 9090,
    routes: routes,
    banner: `UWS test 9090`
};

pinipig.createServer(options);


```


---

- ## Pub Sub example

```javascript
const pinipig = require('../pinipig')


const Subscribe = (ctx) => {
    ctx.ws.subscribe('chat/#');
}

const Publish = (ctx) => {
    try{
        ctx.ws.publish('chat/room01', ctx.message);
    }
  catch(e){
    console.log(e)
  }
}



const routes = [
    {
        url: "/pubsub",   // ws://localhost:9090/pubsub
        ws: {
            options: {
                compression: 0,
                maxPayloadLength: 16 * 1024 * 1024,
                idleTimeout: 0
            },
            open: Subscribe,
            message: Publish,
            drain: null,
            close: null
        }
    }

]

const options = {
    port: 9090,
    routes: routes
}

pinipig.createServer(options)

```


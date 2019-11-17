# Methods available inside context (ctx)

# res (Response)

| Method                        | Description                                                       | Usage                                                              |
| ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| writeStatus                   | send response status                                              | `res.writeStatus('200')`                                           |
| end                           | send end response                                                 | `res.end('Message HERE')`                                          |
| write                         | send message to cliend                                            | `res.send('Hello Client')`                                         |
| writeHeader alias `setHeader` | send the header part                                              | `res.writeHeader('content-type','text/json')`                      |
| writeHead                     | send the header part in sets and with status (node http polyfill) | `res.writeHead(200, { accept: "*", "content-type": "text/json" })` |
| json                          | send json stringified response                                    | `res.json(JSON_OBJECT)`                                            |
| getRemoteAddress              | get client's IP (IPv4 IPv6)                                       | `Buffer.from(res.getRemoteAddress()).toString()`                   |

# req (Request)

| Method       | Description                        | Usage                                                                                                   |
| ------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| getHeader    | get Header of the request          | `req.getHeader('content-type')`                                                                         |
| getParameter | get paramater based on index       | `req.getParameter(0)` to retrieve name value on `\user\:name` route data also available via `data.name` |
| getUrl       | get URL of the request             | `req.getUrl()`                                                                                          |  |
| getMethod    | get Method of the request          | `req.getMethod()`                                                                                       |
| getQuery     |                                    | `req.getQuery()`                                                                                        |
| getHeaders   | get all the Headers sent by client | `req.getHeaders()`                                                                                      |

# ws (Websocket)

| Method            | Description        |
| ----------------- | ------------------ |
| send              |                    |
| end               |                    |
| close             |                    |
| getBufferedAmount |                    |
| subscribe         |                    |
| publish           |                    |
| getRemoteAddress  | get client IPv6/v4 |

# Built-in Middleware

## Authentication

`const {auth} = require('pinipig')`

| Method         | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| encryptPass    | Encrypt the password. most proabbly used before CRUD               |
| issueToken     | issue a token after login form submitted and veriffeid succesfully |
| verify         |                                                                    |
| strategy.local | default login strategy (email, password)                           |

## streamFile

Stream a static file inside a folder

| function              | Description              | Example                                    |
| --------------------- | ------------------------ | ------------------------------------------ |
| streamFile(directory) | value should be a String | `let sf= streamFile('./examples/uploads')` |

Sample script below will stream file inside `examples/uploads` directory via http request GET

sample request `http://domain.com/stream/movie.mp4`

```javascript
...
const { streamFile } = pinipig
let sf = streamFile('./examples/uploads')

...
let routes = [{
...
  {
        url: "/stream/*",
        get: sf,
    },
}]
```

## staticFileServer

Stream a static file inside a folder

| function                    | Description              | Example                                          |
| --------------------------- | ------------------------ | ------------------------------------------------ |
| staticFileServer(directory) | value should be a String | `const staticServer= staticFileServer('public')` |

** directory is the same level as the src folder**

```javascript
...
const { staticFileServer } = pinipig
const staticServer= staticFileServer('public')

...
let routes = [{
...
  {
        url: "/*",
        get: staticServer,
    },
}]
```

# Options

| Options | Type                      | Description                               | Posible Values (example)                     | Optional |
| ------- | ------------------------- | ----------------------------------------- | -------------------------------------------- | -------- |
| routes  | (Object)                  | routes object [see examples](examples.md) | [see examples](examples.md)                  | No       |
| port    | (Integer)                 | port where to serve our Pinipig Server    | 9090                                         | No       |
| banner  | (String / String Literal) | Message when Server start is succesful    | `` `Pinipig Server is listening on 9090 ` `` | Yes      |

# Websockets

## Options

| Options          |
| ---------------- |
| compression      |
| maxPayloadLength |
| idleTimeout      |

### Handlers

| Handlers |
| -------- |
| open     |
| message  |
| drain    |
| close    |

### Data Store Context

| From                                                        | Where is it stored in context |
| ----------------------------------------------------------- | ----------------------------- |
| URL parameter `/url/:username`                              | `ctx.parameters` [Object]     |
| Forms submitted via POST                                    | `ctx.data.fields` [Object]    |
| Files submitted vai multipart form-data                     | `ctx.data.files` [Array]      |
| Query from url `http://localhost:9090/url?name=john&age=18` | `ctx.query` [Object]          |

Code Snippet inside route object

```javascript
post: PostHandler,
get: getHandler,
...
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
```

# ORM

## Supported DB

- MongoDB
- TingoDB
- reThinkDB
- mySQL
- Redis
- Postgres
- SQLite3
- Arango (untested)
- Cassandra (untested)
- Couchbase (untested)
- Firebird (untested)
- Mongoose (untested)
- Neo4j (untested)
- Riak (untested)

## Implementation

```javascript
  const pinipig = require('pinipig')
  ...
  const orm = pinipig.orm

  //configuration
  let dbconf = {
    driver: 'mongo',
    database: 'testDB',
    user: 'username',
    password: 'password'
  }

  //initialization
  let schema = new ORM(dbconf.driver, dbconf)

  //Create Model
  let Post = schema.define('Post', {
    title: {
      type: schema.String
    },
    content: {
      type: schema.String
    },
    date:{
      {
        type: schema.Date,
        default: Date.now
      }
    },
    hidden: {
      type: schema.String
    }
  })

  //create new document

  Post.create({title:'Hello World', content:'CONTENT HERE',hidden:'false'}, (err,data)=>{
    if (err){console.log(err)}

    JSON.stringify({
        result: 'created',
        data: data
      }

  })

```

# CRUD http endpoint

Create Read Update Delete via HTTP endpoint

Requires a Model instantiated by ORM

```javascript
const crud = pinipig.crud

/*  - or -  */

const { crud } = pinipig
```

| method   | Description                                 | input type | options        | output                                                   | sample usage inside route | sample URL request                                                     |
| -------- | ------------------------------------------- | ---------- | -------------- | -------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| create   | create a new entry                          | object     | none           | JSON string via http                                     | see example below         | POST `http://localhost:9090/user`                                      |
| read     | read a single record                        | object     | none           | JSONstring via http                                      | see example below         | GET `http://localhost:9090/user/1`                                     |
| readList | read all data of the model                  | object     | via http query | skip(number), limit](number), order(number),pretty(bool) |                           | GET `http://localhost:9090/user?skip=1&order=name&limit=5&pretty=true` |
| update   | update an existing entry                    | object     | none           | JSON string via http                                     |                           | POST `http://localhost:9090/user/1`                                    |
| destroy  | delete an existing entry                    | object     | none           | JSON string via http                                     |                           | DEL`http://localhost:9090/user/1`                                      |
| count    | a helper method to return the total records | object     | none           | JSON string via http                                     |                           | GET `http://localhost:9090/user/count`                                 |

## Filter CRUD result

To filter result from CRUD request eg. hide password record during API REST request

| property | description                                | type  | Helper Function                                | Application inside route            |
| -------- | ------------------------------------------ | ----- | ---------------------------------------------- | ----------------------------------- |
| filter   | filter out private fields from ORM results | Array | `const { filter } = require('pinipig/filter')` | `get: [filter(['password']), List]` |

# Hooks

Hooks are functions that run before or after the main methods

hooks inside before

```javascript
hooks: {
  before: [hook1, hook2, hook3]
} // arrays
```

will run in consecutive order before the main method

hooks inside afer

```javascript
hooks: {
  before: [hook4, hook5, hook6]
} // arrays
```

will run in consecutive order after the main method is invoke

here's how the flow will look like

```
hook1 -> hook2 -> hook3 -> MainMethod -> hook4 -> hook5 -> hook6
```

### CRUD Endpoints

### Authentication

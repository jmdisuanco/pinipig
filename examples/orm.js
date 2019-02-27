/**
 * ORM Example
 *  
 */

const pinipig = require('../pinipig')

const {
    orm,
    crud
} = pinipig

const {
    create,
    read,
    readList,
    update,
    destroy
} = crud


let {
    cors,
    preFlight
} = pinipig.utils

let Schema = orm.Schema
config = {
    driver: "memory"
}

let schema = new Schema(config.driver, config)

var Post = schema.define('Post', {
    title: {
        type: schema.String,
        limit: 255
    },
    content: {
        type: schema.Text
    },
    params: {
        type: schema.JSON
    },
    date: {
        type: schema.Date,
        default: Date.now
    },
    published: {
        type: schema.Boolean,
        default: false,
        index: true
    }
})


let c = create(Post)
let r = read(Post)
let u = update(Post)
let list = readList(Post)
let d = destroy(Post)

let getMethod = (ctx) => {
    const {
        res,
    } = ctx
    try {
        ctx.res.json(ctx.method)
    } catch (e) {
        console.log('getmethod', e)
        //res.end('')
    }
}

let HelloWorld = function (ctx) {
    ctx.res.setHeader('Content-Type', 'text/html')
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ctx.res.write('Hello World'); // write a response to the client
    ctx.res.end(); // end the response
}



let Query = (ctx) => {
    cors(ctx.res)
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ctx.res.write('<H1>Hello ' + ctx.data.name + '</H1>'); //write a response to the client
    ctx.res.end(); //end the response
}

let FormProcess = (ctx) => {
    cors(ctx.res)
    ctx.res.setHeader('Content-Type', 'text/html')
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    })
    ctx.res.json(ctx.data)
}

let routes = [{
        url: '/',
        GET: HelloWorld
    },
    {
        url: '/post',
        GET: list,
        POST: c,
        PATCH: u,

    },
    {
        url: '/post/:id',
        GET: r,
        DEL: d
    },
    {
        url: '/user/:name', // http://localhost:9090/user/[NAME]
        GET: Query,
        POST: FormProcess,
        OPTIONS: preFlight // Preflight check by browser
    },
    {
        url: '/method',
        get: getMethod,
        POST: getMethod,
        PATCH: getMethod,
        DEL: getMethod
    },

]

let options = {
    port: 9090,
    routes: routes,
    http: 'node'
}

pinipig.createServer(options)
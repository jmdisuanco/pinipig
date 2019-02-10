/**
 * CORS Example
 *  
 */

const pinipig = require('../pinipig')

let {
    cors,
    preFlight
} = pinipig.utils
let HelloWorld = function (ctx) {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ctx.res.write('Working'); //write a response to the client
    ctx.res.end(); //end the response
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
    ctx.res.write(JSON.stringify(ctx.data))
}

let routes = [{
        url: '/',
        GET: HelloWorld
    },
    {
        url: '/user/:name', // http://localhost:3000/user/[NAME]
        GET: Query,
        POST: FormProcess,
        OPTIONS: preFlight // Preflight check by browser
    }

]

let options = {
    port: 9090,
    routes: routes,
    http: 'node'
}

pinipig.createServer(options)
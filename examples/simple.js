/**
 * This is a barebone example using the uWebsocket
 * and taking advantage of pinipig's REST handler
 *  
 * 
 */

const pinipig = require('../pinipig')

let HelloWorld = function (ctx) {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ctx.res.write('Hello World '); //write a response to the client
    ctx.res.end(); //end the response
}

let Query = (ctx) => {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ctx.res.write('<H1>Hello ' + ctx.data.name + '</H1>'); //write a response to the client
    ctx.res.end(); //end the response
}

let routes = [{
        url: '/',
        GET: HelloWorld
    },
    {
        url: '/user/:name', // http://localhost:9090/user/[NAME]
        GET: Query
    }

]

let options = {
    port: 9090,
    routes: routes
}

pinipig.createServer(options)
/**
 * This is an example with Hooks
 * and taking advantage of pinipig's REST handler
 *  
 */

const pinipig = require('../pinipig')

let HelloWorld = function (ctx) {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ctx.res.write('Working'); //write a response to the client
    ctx.res.end(); //end the response
}

let Query = (ctx) => {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ctx.res.write(`<H1> ${ctx.data.num } + 1 =  ${ctx.data.total}</H1>`); //iuput the processed data
    ctx.res.end(); //end the response
    return ctx
}

let addOne = (ctx) => {
    ctx.data.total = parseInt(ctx.data.num) + 1
    return ctx
}

let sytemOut = (ctx) => {
    console.log(ctx.data) //console log to the system
}
let routes = [{
        url: '/',
        GET: HelloWorld
    },
    {
        url: '/add/:num', // http://localhost:3000/add/[Number]
        GET: Query,
        hooks: {
            before: addOne,
            after: sytemOut //console log to the system
        }
    }

]

let options = {
    port: 9090,
    routes: routes
}

pinipig.createServer(options)
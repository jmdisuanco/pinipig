/**
 * This is an example with Hooks
 * and taking advantage of pinipig's REST handler
 *  
 * 
 */

const pinipig = require('../pinipig')
const util = require('util')
const sleep = util.promisify(setTimeout)

let HelloWorld = function (ctx) {
    try {
        // ctx.res.setHeader('Content-Type', 'text/html');
        ctx.res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        ctx.res.write('Working'); //write a response to the client
        ctx.res.end(); //end the response
    } catch (e) {
        console.log(e)
    }
}


let Query = (ctx) => {
    try {
        ctx.res.writeHead(201, {
            'Content-Type': 'text/html'
        });
        ctx.res.write(`<H1> ${ctx.data.num } + 1 =  ${ctx.data.total}</H1>`); //iuput the processed data
        ctx.res.end(); //end the response
        return ctx
    } catch (e) {
        console.log(e)
        ctx.res.end('something went wrong')
    }

}

let QueryPost = (ctx) => {
    ctx.res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    ctx.res.write(`<H1> ${ctx.data.fields.num }</H1>`); //iuput the processed data
    ctx.res.end(); //end the response
    return ctx
}

let addOne = (ctx) => {
    ctx.data.total = parseInt(ctx.data.num) + 1
    return ctx
}

let stampDate = (ctx) => {
    try {
        let heads = ctx.req.headers
        console.log(heads)
        ctx.data.timestamp = Date.now()
        return ctx
    } catch (e) {
        console.log(e)
    }

}
let throttle = async (ctx) => { // this is the depict FS, DB Request or 
    try {
        console.time("Slept for")
        await sleep(3000)
        console.timeEnd("Slept for")
        return ctx
    } catch (e) {
        console.log(e)
    }
}
let getheads = (ctx) => {
    try {
        //let x = ctx.req.headers
        //console.log(x)
        return ctx
    } catch (e) {
        console.log(e)
    }


}

let sytemOut = (ctx) => {
    console.log(ctx.data) //console log to the system
}
let routes = [{
        url: '/',
        get: HelloWorld
    },
    {
        url: '/add/:num', // http://localhost:3000/add/[Number]
        GET: Query,
        hooks: {
            before: [getheads, stampDate, addOne], //functional flow
            after: sytemOut //console log to the system
        }
    },
    {
        url: '/async/:num', // http://localhost:3000/async/
        GET: Query,
        hooks: {
            before: [throttle, addOne], // sleep for 3 secs before serving Query on Webpage
            after: sytemOut //console log to the system
        }
    },


]

let options = {
    port: 9090,
    routes: routes
}

pinipig.createServer(options)
/**
 * This is a DEV workspace @next tag
 * 
 */

const pinipig = require('../pinipig')
// let WS

const Handshake = (ctx) => {
    ctx.ws.send(`Connected via url${ctx.req.getUrl()}`)
}

const Subscribe = (ctx) => {
    ctx.ws.subscribe('chat/#');
}

const WSMessage = (ctx) => {
    try{
        let  data = Buffer.from(ctx.message).toString("binary")
        console.log(ctx.ws.getRemoteAddress())
         let ok = ctx.ws.send(data.toUpperCase(), ctx.isBinary)
    }
  catch(e){
    console.log(e)
  }
}

const Publish = (ctx) => {
    try{
        ctx.ws.publish('chat/room01', ctx.message);
    }
  catch(e){
    console.log(e)
  }
}

const HelloWorld = function (ctx) {
    // get IP 
    let ip= Buffer.from(ctx.res.getRemoteAddress()).toString('hex')
    console.log(ip.replace(/(.{4})/g,"$1:").trim(':'))
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    ctx.res.write('Hello World '); //write a response to the client
    ctx.res.end(); //end the response
}

const Query = (ctx) => {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    ctx.res.write('<H1>Hello ' + ctx.data.name + '</H1>'); //write a response to the client
    ctx.res.end(); //end the response
}

const routes = [{
        url: '/',
        GET: HelloWorld
    },
    {
        url: '/user/:name', // http://localhost:9090/user/[NAME]
        GET: Query
    },
    {
        url: "/ws", // ws://localhost:9090/ws
        ws: {
            options: {
                compression: 0,
                maxPayloadLength: 16 * 1024 * 1024,
                idleTimeout: 100000
            },
            open: Handshake,
            message: WSMessage,
            drain: null,
            close: null
        }
    },
    {
        url: "/pubsub", // ws://localhost:9090/ws
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
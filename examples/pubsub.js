/**
 * This is a PubSub Demo
 * 
 */

const pinipig = require('../pinipig')

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
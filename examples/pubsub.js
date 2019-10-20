/**
 * This is a PubSub Demo
 * 
 */

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
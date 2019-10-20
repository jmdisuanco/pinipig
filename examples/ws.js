/**
 * Websocket Basic Example
 * 
 *
 */

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
/**
 * CORS Example
 * 
 *
 */

const pinipig = require("../pinipig.js")
const path = require('path')
const fs = require('fs')
let {
    cors,
    preFlight
} = pinipig.utils;

let HelloWorld = function (ctx) {
    try {
        ctx.res.writeHead(200, {
            accept: "*",
            "content-type": "text/html"
        });
        // ctx.res.setHeader(
        //     'content-type', 'text/html; charset= utf-8'
        // )
        ctx.res.end("Hello World");
    } catch (e) {
        ctx.res.end();
    }
};
let HelloWorldPOST = function (ctx) {
    try {
        ctx.res.writeHead(200, {
            accept: "*",
            "content-type": "text/json"
        });

        ctx.res.end("Hello World POST");
    } catch (e) {
        ctx.res.end();
    }
};


let Query = ctx => {
    try {
        ctx.res.writeHead(200, {
            accept: "*",
            "content-type": "text/html"
        });
        ctx.res.write("<H1>Hello " + ctx.parameters.name + "</H1>"); //write a response to the client
        ctx.res.end(); //end the response
    } catch (e) {
        console.log(e)
    }

};

let tellURL = ctx => {
    try {
        let url = ctx.req.getUrl()
        ctx.res.end(`url captured was --> ${url}`)
    } catch (e) {

    }
}
let FormProcess = ctx => {
    try {
        try {
            ctx.data.files.map(f => {
                let target = path.join('./examples/uploads/', f.filename)
                fs.rename(f.tmpFilename, target, function (err) {
                    if (err) return
                    console.log(`written ${target}`)
                })
            })
        } catch (e) {
            console.log('no files to process')
        }

        let result = JSON.stringify(ctx.data)
        ctx.res.write(result)
        ctx.res.end()
    } catch (e) {
        ctx.res.end()
        console.log(e);
    }
};

let UploadForm = context => {
    try {
        context.res.writeHeader("content-type", "text/html");
        context.res.write(
            '<form action="/upload" enctype="multipart/form-data" method="post">' +
            '<input type="text" name="title"/><br>' +
            '<input type="file" name="upload" multiple="multiple"><br>' +
            '<input type="submit" value="Upload">' +
            "</form>"
        );
        context.res.end()
    } catch (e) {
        console.log(e);
    }
};

let WSPost = (ctx) => {
    ctx.ws.send(`Connected via ${ctx.req.getUrl()}`)
}
let WSMessage = (ctx) => {
    let ok = ctx.ws.send(ctx.message, ctx.isBinary)

}


let routes = [{
        url: "/",
        get: HelloWorld
    },
    {
        url: "/keep-alive",
        get: HelloWorld,
        post: HelloWorldPOST
    },
    {
        url: "/user/:name", // http://localhost:3000/user/[NAME]
        get: Query,
    },
    {
        url: "/upload",
        get: UploadForm,
        post: FormProcess
    },
    {
        url: "/a/:b",
        get: tellURL,
    },
    {
        url: "/a/b/c",
        get: tellURL,
    },

    {
        url: "/a/b",
        get: tellURL,
    },
    {
        url: "/a",
        get: tellURL,
    },

    {
        url: "/post",
        post: FormProcess,
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
    }

];

let options = {
    port: 9090,
    routes: routes,
    banner: `UWS test 9090`
};

pinipig.createServer(options);
/**
 * This is a barebone example using the HTTP module of Nodejs
 * and taking advantage of pinipig's REST handler
 *  
 */

const pinipig = require('../pinipig')
const fs = require('fs')
const util = require('util')
const sleep = util.promisify(setTimeout)

let HelloWorld = function (context) {
    console.log('helloWorld')
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    context.res.write('Working'); //write a response to the client
    context.res.end(); //end the response
}

let beforehook = (context) => {
    console.log('before')
    context.data['age'] = 90
    return context
}

let beforehook2 = async (ctx) => {
    console.time("Slept for")
    await sleep(3000)
    console.timeEnd("Slept for")
    return ctx
}

let afterhook = (context) => {
    console.log('after')
}

let HelloPost = (context) => {
    console.log('helloPost')
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    context.res.write('POST'); //write a response to the client
    context.res.end(); //end the response
}


let Query = (context) => {
    console.log('Query')
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    context.res.write('<H1>Hello ' + query.name + '</H1>'); //write a response to the client
    context.res.end(); //end the response
}

let QueryAge = (context) => {
    console.log('QueryAge', context.data)
    let query = context.data
    console.log(query)
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    context.res.write('<H1>Hello ' + query.name + '</H1>' + query.age); //write a response to the client
    context.res.end(); //end the response
}

let QueryDesc = (context) => {
    console.log('QueryDesc')
    let query = context.data
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    context.res.write('<H1>Hello ' + query.name + '</H1>' + query.desc + ' ' + query.age); //write a response to the client
    context.res.end(); //end the response
}


let UploadForm = (context) => {
    context.res.writeHead(200, {
        'content-type': 'text/html'
    });
    context.res.write('<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="title"/><br>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    )
    context.res.end();
    return context.res.end();
}

let UploadFormProcess = (context) => {
    let data = context.data
    let tmpPath = data.files.upload.path
    let newPath = './examples/uploads/' + data.files.upload.name //Make sure you created uploads folder in your App root.
    fs.rename(tmpPath, newPath, function (err) {
        if (err) throw err;
        context.res.write('File uploaded with title ' + data.fields.title + '!');
        context.res.end();
    });
}

let routes = [{
        url: '/age/:age/:name', // http://localhost:3000/age/21/Joe
        GET: QueryAge,
        hooks: {
            before: [beforehook, beforehook2],
            after: [afterhook]
        }
    },
    {
        url: '/',
        GET: HelloWorld,
        POST: [HelloPost],
        hooks: {
            before: [beforehook2],
            after: [afterhook]
        }
    },
    {
        url: '/age/:age/:name/:desc', // http://localhost:3000/age/33/Jane
        GET: QueryDesc,
        hooks: {
            before: [beforehook, beforehook2],
            after: [afterhook]
        }
    },
    {
        url: '/user/:name', // http://localhost:3000/user/
        GET: Query
    },
    {
        url: '/form', // http://localhost:3000/user/
        GET: UploadForm
    },
    {
        url: '/upload', // http://localhost:3000/user/
        POST: UploadFormProcess
    }
]

let options = {
    port: 9090,
    routes: routes
}

pinipig.createServer(options)
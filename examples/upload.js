/**
 * This is a example of handling upload in Pinipig server
 *  
 *  -- > Make sure you created uploads folder in your App root. < --
 */

const pinipig = require('../pinipig')
const fs = require('fs')
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
        url: '/',
        GET: UploadForm
    },
    {
        url: '/upload',
        POST: UploadFormProcess
    }

]

let options = {
    port: 9090,
    routes: routes,
    http: 'node'
}

pinipig.createServer(options)
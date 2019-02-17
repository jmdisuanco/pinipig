/**
 * UPLOAD Example
 *
 * 
 */

const pinipig = require("../pinipig.js")
const path = require('path')
const fs = require('fs')

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
            '<form action="/" enctype="multipart/form-data" method="post">' +
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

let routes = [{
    url: "/",
    get: UploadForm,
    post: FormProcess
}];

let options = {
    port: 9090,
    routes: routes,
    banner: `UWS test 9090`
};

pinipig.createServer(options);
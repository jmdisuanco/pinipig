/**
 * This is a barebone example using the HTTP module of Nodejs
 * and taking advantage of pinipig's REST handler
 *  
 */

const pinipig = require('../pinipig')
const fs = require('fs')
var HelloWorld = function(req,res){
    console.log('helloWorld')
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working'); //write a response to the client
    res.end(); //end the response
}

var HelloPost = function(req,res,query){
    console.log('helloPost')
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('POST'); //write a response to the client
    res.end(); //end the response
}


var Query = function(req,res,query){
    console.log('Query')
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<H1>Hello '+query.name+'</H1>'); //write a response to the client
    res.end(); //end the response
}

var QueryAge = function(req,res,query){
    console.log('QueryAge',query)
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<H1>Hello '+query.name+'</H1>'+query.age); //write a response to the client
    res.end(); //end the response
}

var QueryDesc = function(req,res,query){
    console.log('QueryDesc')
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<H1>Hello '+query.name+'</H1>'+query.desc+' '+query.age); //write a response to the client
    res.end(); //end the response
}


var UploadForm = function (req,res){
    res.writeHead(200, {'content-type': 'text/html'});
    res.write('<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"/><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    )
    res.end();
    return res.end();
}

var UploadFormProcess = function (req,res,data) {
    var tmpPath = data.files.upload.path
    var newPath = './uploads/'+data.files.upload.name //Make sure you created uploads folder in your App root.
    fs.rename(tmpPath, newPath, function (err) {
        if (err) throw err;
        res.write('File uploaded with title '+data.fields.title+'!');
        res.end();
      });
    }

var routes =[
    {    
        url:'/age/:age/:name', // http://localhost:3000/age/21/Joe
        GET: QueryAge
    },
    {    
        url:'/',
        GET: HelloWorld,
        POST: HelloPost
    },
    {    
        url:'/age/:age/:name/:desc', // http://localhost:3000/age/33/Jane
        GET: QueryDesc
    },
    {    
        url:'/user/:name', // http://localhost:3000/user/
        GET: Query
    },
    {    
        url:'/form', // http://localhost:3000/user/
        GET: UploadForm
    },
    {    
        url:'/upload', // http://localhost:3000/user/
        POST: UploadFormProcess
    }
]

var options = {
    port: 3000,
    routes: routes
}

pinipig.createServer(options)
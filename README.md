# Pinipig
![](https://img.shields.io/github/issues/jmdisuanco/pinipig.svg)
![](https://img.shields.io/github/license/jmdisuanco/pinipig.svg) ![](https://img.shields.io/twitter/url/https/github.com/jmdisuanco/pinipig.svg?style=social)
![](https://img.shields.io/github/commit-activity/y/jmdisuanco/pinipig.svg)

Version : 1.0.3

A super `simple` `REST` webservice (HTTP)  framework


Version 1 released!

## What's in version 1
- Routes
- Hooks
    - before
    - after
- Inbuilt file upload

## What are Hooks
hooks are functions that run before of after the main methods

hooks inside before
```javascript
 hooks:{before: [hook1, hook2, hook3]} // arrays
 ```
will run in consecutive order before the main method

hooks inside afer
```javascript
 hooks:{before: [hook4, hook5, hook6]} // arrays
 ```
will run in consecutive order after the main method is invoke

here's how the flow will look like
```
hook1 -> hook2 -> hook3 -> MainMethod -> hook4 ->hook5 -> hook6
```


## Getting Started

using Pinipig toolkit is pretty easy

installing the pinipig toolkit via npm

`npm install --save pinipig`



## Pinipig in action!

Let's do the Pinipig crunch! 

```javascript
/**
 * This is a barebone example using the HTTP module of Nodejs
 * and taking advantage of pinipig's REST handler
 *  
 */

const pinipig = require('pinipig')
const fs = require('fs')

let HelloWorld = function(context){
    console.log('helloWorld')
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, { 'Content-Type': 'text/html' });
    context.res.write('Working'); //write a response to the client
    context.res.end(); //end the response
}

let beforehook = (context) => {
    console.log('before')
    console.log(context.data)
    context.data['age'] = 90 
}

let beforehook2 = () => {
    console.log('before 2')
}

let afterhook = () => {
    console.log('after')
}

let HelloPost = (context) => {
    console.log('helloPost')
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, { 'Content-Type': 'text/html' });
    context.res.write('POST'); //write a response to the client
    context.res.end(); //end the response
}


let Query = (context) => {
    console.log('Query')
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, { 'Content-Type': 'text/html' });
    context.res.write('<H1>Hello '+query.name+'</H1>'); //write a response to the client
    context.res.end(); //end the response
}

let QueryAge = (context) => {
    console.log('QueryAge',context.data)
    let query = context.data
    console.log(query)
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, { 'Content-Type': 'text/html' });
    context.res.write('<H1>Hello '+query.name+'</H1>'+query.age); //write a response to the client
    context.res.end(); //end the response
}

let QueryDesc = (context) => {
    console.log('QueryDesc')
    let query = context.data
    context.res.setHeader('Content-Type', 'text/html');
    context.res.writeHead(200, { 'Content-Type': 'text/html' });
    context.res.write('<H1>Hello '+query.name+'</H1>'+query.desc+' '+query.age); //write a response to the client
    context.res.end(); //end the response
}


let UploadForm = (context) => {
    context.res.writeHead(200, {'content-type': 'text/html'});
    context.res.write('<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"/><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    )
    context.res.end();
    return context.res.end();
}

let UploadFormProcess =  (context) => {
    let data = context.data
    let tmpPath = data.files.upload.path
    let newPath = './examples/uploads/'+data.files.upload.name //Make sure you created uploads folder in your App root.
    fs.rename(tmpPath, newPath, function (err) {
        if (err) throw err;
        context.res.write('File uploaded with title '+data.fields.title+'!');
        context.res.end();
      });
    }

let routes =[
    {    
        url:'/age/:age/:name', // http://localhost:3000/age/21/Joe
        GET: QueryAge,
        hooks:{
            before:[beforehook, beforehook2],
            after: [afterhook]
        }
    },
    {    
        url:'/',
        GET: HelloWorld,
        POST: HelloPost,
        hooks:{
            before:[beforehook, beforehook2],
            after: [afterhook]
        }
    },
    {    
        url:'/age/:age/:name/:desc', // http://localhost:3000/age/33/Jane
        GET: QueryDesc,
        hooks:{
            before:[beforehook, beforehook2],
            after: [afterhook]
        }
    },
    {    
        url:'/user/:name', // http://localhost:3000/user/jane
        GET: Query
    },
    {    
        url:'/form', // http://localhost:3000/form
        GET: UploadForm
    },
    {    
        url:'/upload', // http://localhost:3000/user/
        POST: UploadFormProcess
    }
]

let options = {
    port: 3000,
    routes: routes
}

pinipig.createServer(options)
```


**Breaking Changes for updates from 0.4.0 to 1.0.0**
1. The res and req methods are now inside the context object
2. query and data objects are in data objects

this is how it looks like
```javascript
context = {
    res: res,
    req: req,
    data: dataObjectHere
}
```
If you are coming from lower version this is how you update your routes methods

```javascript

//from this
let HelloWorld = (req,res) => {
    console.log('helloWorld')
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working'); //write a response to the client
    res.end(); //end the response
}

//to this
let HelloWorld = (context) => {
    let res = context.res // <--- assign this
    console.log('helloWorld')
    context.res.setHeader('Content-Type', 'text/html'); //<-- you can have it like this
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working'); //write a response to the client
    res.end(); //end the response
}

//another example
//from this below version 1
var Query = (req,res,query) => {
    console.log('Query')
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<H1>Hello '+query.name+'</H1>'); //write a response to the client
    res.end(); //end the response
}

//to this
var Query = (context) => {
    let res = context.res
    let query = context.data
    console.log('Query')
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<H1>Hello '+query.name+'</H1>'); //write a response to the client
    res.end(); //end the response
}
```

```
  _____    _           _           _         
 |  __ \  (_)         (_)         (_)        
 | |__) |  _   _ __    _   _ __    _    __ _ 
 |  ___/  | | | '_ \  | | | '_ \  | |  / _` |
 | |      | | | | | | | | | |_) | | | | (_| |
 |_|      |_| |_| |_| |_| | .__/  |_|  \__, |
                          | |           __/ |
                          |_|          |___/ 
```


# License

MIT &copy;  JOHN MARTIN DISUANCO

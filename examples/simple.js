/**
 * This is a barebone example using the HTTP module of Nodejs
 * and taking advantage of pinipig's REST handler
 *  
 */

const pinipig = require('../pinipig')

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

var routes =[
    {    
        url:'/age/:age/:name', // http://localhost:3000/age/99/john
        GET: QueryAge
    },
    {    
        url:'/',
        GET: HelloWorld,
        POST: HelloPost
    },
    {    
        url:'/age/:age/:name/:desc', // http://localhost:3000/age/99/john
        GET: QueryDesc
    },
    {    
        url:'/user/:name', // http://localhost:3000/user/john
        GET: Query
    }
]

var options = {
    port: 3000,
    routes: routes
}

pinipig.createServer(options)
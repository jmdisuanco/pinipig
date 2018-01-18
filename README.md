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
# Pinipig
A super `simple` webservice (HTTP)  framework

**Work in Progress** :hatching_chick: API might change


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

var HelloWorld = function(req,res){
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('Working'); //write a response to the client
    res.end(); //end the response
}

var HelloPost = function(req,res,query){
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('POST'); //write a response to the client
    res.end(); //end the response
}

var Test = function(req,res,query){
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(404, { 'Content-Type': 'text/html' });
    console.log(query)
    res.write('test'); //write a response to the client
    res.end(); //end the response
}


var Query = function(req,res,query){
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<H1>Hello '+query.name+'</H1>'); //write a response to the client
    res.end(); //end the response
}

var routes =[
    {    
        url:'/',
        GET: HelloWorld,
        POST: HelloPost
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

```



#License

MIT &copy; 2018 JOHN MARTIN DISUANCO
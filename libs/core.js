/**********************************************************************************************/
/****************************CORE  MODULES  *****************************************/
/**********************************************************************************************/

function noMatch(req,res){
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>404</h1><h5>resource not found...</h5>')
    res.end();
}

/**
 *  #TODO 
 */

function http(payload,req,res){
    //#load module
    //#preloading
    // ##response part ##
    //header part
    var data ={
        res: res,
        req: req,
        msg: ''
    }
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    //the response
    task = payload
    res.write(task(data)); //write a response to the client
    //before ending
    res.end(); //end the response
}

/**
 *  #TODO 
 */

function json(payload,req,res){
    //#load module
    //#preloading
    // ##response part ##
    //header part
    var data ={
        res: res,
        req: req,
        msg: ''
    }
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    //the response
    task = payload
    res.write(task(data)); //write a response to the client
    //before ending
    res.end(); //end the response
}

/**********************************************************************************************/

module.exports = {
    noMatch : noMatch
}
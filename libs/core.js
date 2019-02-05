/**********************************************************************************************/
/****************************CORE  MODULES  *****************************************/
/**********************************************************************************************/

function noMatch(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(404, {
        'Content-Type': 'text/html'
    });
    res.write('<h1>404</h1><h5>resource not found...</h5>')
    res.end();
}

let getURLQuery = (req) => {
    let url = req.url.split('?')
    let kvp = {}
    if (url[1]) {
        let queries = url[1].split('&')
        queries.map(data => {
            let d = data.split('=')
            let key = decodeURI(d[0])
            Object.assign(kvp, {
                [key]: decodeURI(d[1])
            })
        })
        return kvp
    }
}


let flow = (fns) => param => {
    try {
        fns.reduce(async (payload, nxt) => nxt(await payload), param)
    } catch (e) {
        const err = new Error(`Parameter should be array of methods:
  Example usage-> flow([func1,func2,func3])`)
        console.error(err.message)
    }
}

/**
 *  #TODO 
 */

function http(payload, req, res) {
    //#load module
    //#preloading
    // ##response part ##
    //header part
    var data = {
        res: res,
        req: req,
        msg: ''
    }
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    //the response
    task = payload
    res.write(task(data)); //write a response to the client
    //before ending
    res.end(); //end the response
}

/**
 *  #TODO 
 */

function json(payload, req, res) {
    //#load module
    //#preloading
    // ##response part ##
    //header part
    var data = {
        res: res,
        req: req,
        msg: ''
    }
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    //the response
    task = payload
    res.write(task(data)); //write a response to the client
    //before ending
    res.end(); //end the response
}

/**********************************************************************************************/

module.exports = {
    noMatch,
    getURLQuery,
    flow
}
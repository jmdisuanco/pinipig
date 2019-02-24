/**********************************************************************************************/
/************************************* CORE  MODULES  *****************************************/
/**********************************************************************************************/

const orderBy = require("lodash/orderBy")
const c = require("8colors")
const pkg = require("../package")
const commonHeaders = require('./commonheaders')
const {
    formUrlencodedHandler,
    formdataHandler
} = require('./uploadhandler')
let allowedHTTPMethods = ['get', 'post', 'options', 'put', 'patch', 'del', 'head']

let noMatch = (res, req) => {
    res.writeStatus('404')
    res.writeHeader('Content-Type', 'text/json');
    res.end('{"result":"no resource found"}')
}

/**
 * Flatten Nested Arrays
 * @param {Array} arrays | [['a'],['b],['c','d']]
 */
let flatten = (arrays) => {
    return arrays.reduce((a, b) => a.concat(b), [])
}

/**
 * Get the Value enclosed in qoutes "VALUE"
 * @param {String} str 
 */



/**
 * Memoize Functions (Pure)
 * @param {Function} fn 
 */
let memoize = (fn) => {
    let cache = {}
    return (...args) => {
        let n = args[0]
        if (n in cache) {
            return cache[n]
        } else {
            let result = fn(n)
            cache[n] = result
            return result
        }
    }

}

/**
 * CORS
 * @param {Obectt} Response ctx.res
 */
let cors = (res) => {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*'
    });

}
/**
 * Preflight response
 * This is usually attached on OPTIONS method for browser's pre-flight checking response
 * @param {Object} res 
 */
let preFlight = (res) => {
    cors(res)
    res.end()
}

let getURLQuery = (req) => {
    let url = req.getQuery().split('?')
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


let getUriData = (url, req) => {
    let data = {}
    let search = /(:\w*)/g
    if (search.test(url)) {
        let key = url.match(search)
        key.map((k, i) => {
            let key = k.replace(':', '')
            let value = req.getParameter(i)
            Object.assign(data, {
                [key]: value
            })
        })
        return data
    } else {
        return {}
    }

}

let flow = (fns) => param => {
    try {
        fns.reduce(async (payload, nxt) => nxt(await payload), param)
    } catch (e) {
        const err = new Error(`Parameter should be array of methods:
  Example usage-> flow( [ func1, func2, func3 ] )`)
        console.error(err.message)
        // console.log(`Expected Array but instead received ${typeof fns}`)
    }
}

let getHeaders = (req) => {
    try {
        let Headers = {}
        commonHeaders.map(header => {
            let value = req.getHeader(header)
            if (value != '') {
                Object.assign(Headers, {
                    [header]: value
                })
            }
        })
        return Headers
    } catch (e) {
        console.log('unable to get Headers')
    }

}

let payload = (res, req, urlTemplate) => {
    let context = {
        res,
        req,
    }
    res.setHeader = res.writeHeader
    //context.req.headers = getHeaders(req) /*BOTTLENECK */ : null
    context.req.getHeaders = getHeaders
    context.getURLQuery = getURLQuery
    //context.method = req.getMethod()
    //context.data = getUriData
    urlTemplate.search(':') ? context.parameters = getUriData(urlTemplate, req) /*BOTTLENECK */ : null
    urlTemplate.search('\\?') ? context.query = getURLQuery(req) /*BOTTLENECK */ : null
    res.writeHead = (status, headers) => {
        try {
            res.writeStatus(status.toString());
            let headerset = Object.entries(headers);
            headerset.map(header => {
                res.writeHeader(header[0], header[1]);
            });
        } catch (e) {
            return
        }
        return;
    }
    return context
}

let MethodLoader = App => (route, routeObj, Flow) => {
    let method = route[0].toLowerCase()
    let url = routeObj.url
    if (allowedHTTPMethods.includes(method)) {
        App[method](url, async (res, req) => {
            try {
                res.onAborted(() => {
                    console.log('aborted...')
                })
                let ctx = payload(res, req, routeObj.url)
                res.onAborted(() => {
                    return
                })
                Flow(ctx)
            } catch (e) {
                console.log(e)
                return
            }
        })
    }
    if (method === 'ws') {
        let wsFunc = route[1]
        let options = route[1].options
        App.ws(url, {
            /* Options */
            compression: options.compression,
            maxPayloadLength: options.maxPayloadLength,
            idleTimeout: options.idleTimeout,
            /* Handlers */

            open: (ws, req) => {
                let context = {
                    ws,
                    req
                }
                try {
                    wsFunc.open(context)
                } catch (e) {
                    msg = `Pinipig WS connected via URL: ${url}`
                    ws.send(msg)
                    //console.log(`Pinipig WS connected via URL: ${url}!`)
                }

            },
            message: (ws, message, isBinary) => {
                let context = {
                    isBinary,
                    message,
                    ws
                }
                try {
                    wsFunc.message(context)
                } catch (e) {
                    console.log('WS message handler not define in routes')
                    ws.close()
                }
                /* Ok is false if backpressure was built up, wait for drain */
                //let ok = ws.send(message, isBinary);
            },
            drain: (ws) => {
                let context = {
                    ws
                }
                try {
                    wsFunc.message(context)
                } catch (e) {
                    console.log('WS drain handler not define in routes')
                    ws.close()
                }
            },
            close: (ws, code, message) => {

                console.log('WebSocket closed');
            }
        })
    }
}


let POSTHandler = (callback, init) => (context) => {
    if (init) {
        context = init(context)
    }

    let formUrlencoded = formUrlencodedHandler(callback)
    let formdata = formdataHandler(callback)
    //context.cb = callback
    let type = context.req.getHeader('content-type')
    type = type.split(";")[0]
    //console.log(`Processing ${type}`)
    let data = ""
    let isFirst = true
    context.res.onAborted(() => {
        return false
    })
    context.res.onData((chunk, isLast) => {
        data += Buffer.from(chunk).toString("binary")
        if (isFirst) {
            //First chunk action here
            //Detect File via File signature
            // let firstChunk = Buffer.from(chunk)
            // let magicN = Buffer.alloc(4, firstChunk).toString('hex')
        }
        isFirst = false
        if (isLast) {
            context.rawdata = data
            if (type == "application/x-www-form-urlencoded") {
                //formUrlencodedHandler(context)
                formUrlencoded(context)
            } else {
                formdata(context)
                //formdataHandler(context)
            }
        }
    })
}


let composedFn = (Obj, hooks) => {
    let prop = Obj[0].toLowerCase()
    let beforeHooks = []
    let afterHooks = []
    let cb = []
    let init
    if (hooks) {
        hooks.before ? beforeHooks = hooks.before : null
        hooks.after ? afterHooks = hooks.after : null
    }
    let postMethods = ['post', 'patch']

    if (allowedHTTPMethods.includes(prop)) {
        // if (!postMethods.includes(prop)) {
        //     cb = Obj[1]
        // } else {
        //     cb = POSTHandler(Obj[1]) //Bug Starts here 
        // }
        //check if theres and init func
        typeof Obj[1] == 'object' && Obj[1][0].name.includes('init_') ? init = Obj[1][0] : null
        if (init) {
            delete(Obj[1][0])
            console.log(init)
        }

        let initFN = (cb, init) => context => {
            try {
                if (init) {
                    ctx = init(context)
                } else {
                    ctx = context
                }
                return cb(ctx)
            } catch (e) {
                console.log(e)
            }
        }

        let flw
        if (typeof Obj[1] == 'object') {
            flw = flow(Obj[1])
        } else {
            flw = Obj[1]
        }



        !postMethods.includes(prop) ? cb = initFN(Obj[1], init) : cb = POSTHandler(flw, init)

        if (beforeHooks == '' && typeof cb == 'function' && afterHooks == '') {
            return cb
        } else {
            let merged = flatten([beforeHooks, cb, afterHooks])
            return flow(merged)
        }
    }
}

let generateApp = App => (options) => {
    let routes = orderBy(
        options.routes,
        o => {
            return o.url.length;
        },
        "desc"
    )
    let Loader = MethodLoader(App)
    routes.map((routes) => {
        Object.entries(routes).map(
            (route) => {
                let Flow = composedFn(route, routes.hooks)
                if (Flow) {
                    Loader(route, routes, Flow)
                }

            }
        )
    })


    App.any('/*', (res, req) => {
        noMatch(res, req)
    })

    App.listen(options.port, token => {
        if (token) {
            tkn = token
            let msg = c
                .by(`Pinipig v${pkg.version} Listening on port: `)
                .bm(`${options.port}`)
                .end();
            options.banner != undefined ? (msg = options.banner) : null;
            console.log(msg);
        } else {
            console.log(`Pinipig v${pkg.version} Failed on port ${options.port}`);
        }
    })
}
module.exports = {
    cors,
    noMatch,
    getURLQuery,
    flow,
    flatten,
    preFlight,
    memoize,
    getHeaders,
    generateApp
}
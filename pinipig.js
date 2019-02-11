const http = require("http")
const microHTTP = require('./libs/uws').http
const c = require("8colors")
const orderBy = require("lodash/orderBy")
const forEach = require("lodash/forEach")
const replace = require("lodash/replace")
const zipObject = require("lodash/zipObject")
const pickBy = require("lodash/pickBy")
const invert = require("lodash/invert")
const core = require("./libs/core")
const os = require('os')
const {
    cors,
    flow,
    flatten,
    preFlight,
    memoize
} = core
const cluster = require('cluster')
const formidable = require("formidable");
let options;
let cpus = os.cpus().length

// let beforeHook = () => {
//     return;
// };
// let afterHook = () => {
//     return;
// };

let beforeHook = []
let afterHook = []
let sHTTP = (req, res) => {
    //simple http
    let cb;
    let count = 1;
    let exp = false;
    let hit = false;
    let restful = false;
    let pattern = regexify(options.sorted);
    forEach(pattern, function (value) {
        let exp = RegExp(value.regex);
        let context = {
            req: req,
            res: res,
            data: {}
        };
        if (exp.test(req.url) == true) {
            hit = true;
            let method = req.method;
            if (value.url.search(":") > 0) {
                context.data = getURIData({
                    keys: req.url,
                    value: value.url
                })
            }
            context.query = core.getURLQuery(req)
            if (method && value[method]) {
                // check if a service is available for the request method
                cb = value[method]
                value.hooks != undefined ? beforeHook = value.hooks.before : null
                value.hooks != undefined ? afterHook = value.hooks.after : null

                if (method == "POST" || method == "PUT" || method == "PATCH") {
                    context.cb = cb;
                    let merged = flatten([beforeHook, getXwfu, afterHook])
                    flow(merged)(context)
                    return false;
                } else if (method === "OPTIONS") {
                    preFlight(context.res)

                } else {
                    let merged = flatten([beforeHook, cb, afterHook])
                    flow(merged)(context)
                    return false
                }
            } else {
                cb = core.noMatch;
                //beforeHook();
                cb(context.req, context.res);
                //afterHook();
                return false;
            }
        }
    });
    if (!hit) {
        //display 404 if no match was hit during the iteration
        cb = core.noMatch;
        cb(req, res);
    }
};

let regexify = memoize(obj => {
    // let regexified
    let replaceWith = "([a-z0-9A-Z:,_-]*)";
    regexified = forEach(obj, function (value) {
        value.regex = replace(value.url, /(:[a-z]*)/g, replaceWith);
        if (value.regex == "/") {
            value.regex = replace(value.url, "/", "^(/)$");
        }
    });
    return obj;
})

// let getXwfu = (cb, req, res) => { //Extract X-WWW-form-urlencoded
//     req.on('data', (chunk) => {
//         try {
//             let query = []
//             let data_str = chunk.toString()
//             _.split(decodeURIComponent(data_str), '&')
//                 .forEach(function (value) {
//                     query.push(_.split(value, '='))
//                 })
//             let results = _.fromPairs(query)
//         } catch (e) {
//             results = chunk;
//         }

//         cb(req, res, results)
//     })

// }
let getXwfu = context => {
    //Extract X-WWW-form-urlencoded
    try {
        let form = new formidable.IncomingForm();
        form.parse(context.req, function (err, fields, files) {
            let data = {
                fields: fields,
                files: files
            };
            //context.data = data
            Object.assign(context.data, data)
            context.cb(context)
            return context
        })
    } catch (e) {
        console.log(e)
    }
}


// let getURIData = (sourcedata, sourcekey) => {
//     keys = sourcekey.split("/")
//     data = sourcedata.split("/")
//     console.log('old', keys, data)
//     mapped = zipObject(keys, data)
//     let qdata = []
//     let result = pickBy(mapped, function (value, key) {
//         return key.startsWith(":")
//     })
//     let inv = forEach(invert(result), function (k, v) {
//         let newkey = k.replace(":", "")
//         qdata[newkey] = v
//     })
//     return qdata
// }
let getURIData = memoize((source) => {
    keys = source.keys.split("/")
    data = source.value.split("/")
    mapped = zipObject(data, keys)
    let qdata = []
    let result = pickBy(mapped, function (value, key) {
        return key.startsWith(":")
    })
    let inv = forEach(invert(result), function (k, v) {
        let newkey = k.replace(":", "")
        qdata[newkey] = v
    })
    return qdata
    //return source

})

let createServer = opt => {
    //initiate the options
    options = opt
    let workers = cpus
    let httpserver = http
    options.worker === undefined ? options.worker = cpus : null
    options.http === undefined || options.http === 'node' ? httpserver = http : null
    options.http === 'micro' ? httpserver = microHTTP : null
    options.worker > cpus ? workers = cpus : workers = parseInt(options.worker)
    options.sorted = orderBy(
        options.routes,
        function (o) {
            return o.url.length;
        },
        "desc"
    );
    if (cluster.isMaster && options.http === 'node' && options.worker != 1) {
        console.log(`Master ${process.pid} is running`)
        console.log(`${workers} worker/s out of ${cpus} will be started`)
        for (let i = 0; i < workers; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} halted`)
            cluster.fork() //respawn 
        })
    } else {
        return httpserver
            .createServer(function (req, res) {
                sHTTP(req, res);
            })
            .listen(options.port, function () {
                let msg = c
                    .by(`Worker ${process.pid} | Pinipig Server is listening on `)
                    .m(options.port)
                    .end()
                options.banner != undefined ? msg = options.banner : null
                console.log(msg)
            })
    }
}

module.exports = {
    createServer: createServer,
    utils: {
        cors,
        flow,
        flatten,
        color: c,
        preFlight
    }
}
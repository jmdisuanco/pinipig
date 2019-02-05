const http = require("http");
const c = require("8colors");
const orderBy = require("lodash/orderBy");
const forEach = require("lodash/forEach");
const replace = require("lodash/replace");
const zipObject = require("lodash/zipObject");
const pickBy = require("lodash/pickBy");
const invert = require("lodash/invert");
const core = require("./libs/core");
const flow = core.flow
const formidable = require("formidable");
let options;
let beforeHook = () => {
    return;
};
let afterHook = () => {
    return;
};

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
                context.data = getURIData(req.url, value.url);
            }
            context.query = core.getURLQuery(req)
            if (method && value[method]) {
                // check if a service is available for the request method
                cb = value[method];
                value.hooks != undefined ? beforeHook = flow(value.hooks.before) : null
                value.hooks != undefined ? afterHook = flow(value.hooks.after) : null
                if (method == "POST" || method == "PUT" || method == "PATCH") {
                    context.cb = cb;
                    beforeHook(context);
                    getXwfu(context); //run x-www-form-urlencode
                    afterHook(context);
                    return false;
                } else {
                    beforeHook(context)
                    cb(context)
                    afterHook(context)
                    return false
                }
            } else {
                cb = core.noMatch;
                beforeHook();
                cb(context.req, context.res);
                afterHook();
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

let regexify = obj => {
    // let regexified
    let replaceWith = "([a-z0-9A-Z:,_-]*)";
    regexified = forEach(obj, function (value) {
        value.regex = replace(value.url, /(:[a-z]*)/g, replaceWith);
        if (value.regex == "/") {
            value.regex = replace(value.url, "/", "^(/)$");
        }
    });
    return obj;
};

let getXwfu = context => {
    //Extract X-WWW-form-urlencoded
    let form = new formidable.IncomingForm();
    form.parse(context.req, function (err, fields, files) {
        let data = {
            fields: fields,
            files: files
        };
        //context.data = data
        Object.assign(context.data, data);
        context.cb(context);
    });
};

let getURIData = (sourcedata, sourcekey) => {
    keys = sourcekey.split("/");
    data = sourcedata.split("/");
    mapped = zipObject(keys, data);
    var qdata = [];
    var result = pickBy(mapped, function (value, key) {
        return key.startsWith(":");
    });

    var inv = forEach(invert(result), function (k, v) {
        var newkey = k.replace(":", "");
        qdata[newkey] = v;
    });
    return qdata;
};

let createServer = opt => {
    //initiate the options
    options = opt;
    options.sorted = orderBy(
        options.routes,
        function (o) {
            return o.url.length;
        },
        "desc"
    );

    return http
        .createServer(function (req, res) {
            sHTTP(req, res);
        })
        .listen(options.port, function () {
            let msg = c
                .by("Pinipig Server is listening on ")
                .m(options.port)
                .end();
            options.banner != undefined ? msg = options.banner : null

            console.log(msg);

        });
};

module.exports = {
    createServer: createServer,
    flow
};
const http = require('http')
const _ = require('lodash')
const c = require('8colors')
const core = require('./libs/core')
var options



function sHTTP(req,res){ //simple http
    var cb
    var count = 1
    var exp=false
    var hit = false
    var restful= false
    var pattern = regexify(options.sorted)
    _.forEach(pattern, function(value){
        var exp = RegExp(value.regex)
        if(exp.test(req.url) == true) {
            hit = true
            var method = req.method
            var query
            console.log('Find',exp)
            if(value.url.search(':') > 0){
                console.log('reading url data...')
                query = getURIData(req.url, value.url)
            }
            if( method && value[method]){ // check if a service is available for the request method
                cb =value[method]
                if( method =='POST'){
                    getXwfu(cb,req,res) //run x-www-form-urlencode
                    return false
                }else{
                    cb(req,res,query)    
                    return false
                }
            }else{
                console.log('no method')
                cb = core.noMatch
                cb(req,res,query)
                return false
            }
        }
    })
    if(!hit){ //display 404 if no match was hit during the iteration
        cb = core.noMatch
        cb(req,res)
    }

}

function regexify(obj){           
    var regexified
    var replaceWith = '([a-z0-9A-Z]*)'
   regexified =  _.forEach(obj,function(value){
        value.regex= _.replace(value.url,/(:[a-z]*)/g,replaceWith)
        if(value.regex =='/'){
            value.regex =_.replace(value.url,'/','^(\/)$')
           }
    })
    return obj
}

function getXwfu(cb,req,res){ //Extract X-WWW-form-urlencoded
    req.on('data', (chunk) => {
        var query =[]
        var data_str = chunk.toString()
        //console.log(data_str)
        _.split(decodeURIComponent(data_str),'&')
        .forEach(function(value){
            query.push(_.split(value,'='))
        })
        var results = _.fromPairs(query)
        cb(req,res,results)
      })
    
}

function getURIData(sourcedata, sourcekey){
    keys = sourcekey.split('/')
    data = sourcedata.split('/')
    mapped =_.zipObject(keys,data)
    var qdata =[]
    var result = _.pickBy(mapped, function(value, key) {
        return key.startsWith(":")
    });

    var inv = _.forEach(_.invert(result), function(k,v){
        var newkey = k.replace(':','')
        qdata[newkey] = v
    })
    return qdata
}

function createServer(opt){
    //initiate the options
    options = opt
    options.sorted = _.orderBy(options.routes, function (o) {
        return o.url.length
    }, 'desc') 

    http.createServer(function (req, res) {sHTTP(req,res)})
        .listen(options.port,function(){
            var msg = c.by('Pininig Server is listening on ').m(options.port).end()
            console.log(msg)
        })
}

module.exports = {
    createServer: createServer
}
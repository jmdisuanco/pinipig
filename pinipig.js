/*

MIT License

Copyright (c) 2018 John Martin R. Disuanco

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

const c = require('8colors')
const uWS = require('uWebSockets.js')
const core = require('./libs/core')
const orm = require('./libs/orm')
const crud = require('./libs/crud')
const privatecrud = require('./libs/privatecrud')
const getMime = require('./libs/getmime')
const auth = require('./libs/authentication')
const streamFile = require('./libs/streamfile')
const staticFileServer = require('./libs/staticfileserver')
const filter = require('./libs/filter')
const token = require('./libs/token')
const { cors, flatten, preFlight, flow, generateApp, memoize } = core

// let options

let createServer = (options) => {
  //initiate the options
  //options = opt;

  let App = generateApp(uWS.App())
  App(options)
}

module.exports = {
  auth,
  createServer,
  crud,
  privatecrud,
  orm,
  streamFile,
  staticFileServer,
  utils: {
    cors,
    color: c,
    filter,
    flow,
    flatten,
    getMime,
    preFlight,
    memoize,
    token,
  },
}

const c = require("8colors");
const uWS = require("uWebSockets.js");
const core = require("./libs/core");
const orm = require("./libs/orm")
const crud = require("./libs/crud")
const auth = require('./libs/authentication')
const streamFile = require('./libs/streamfile')
const {
  cors,
  flatten,
  preFlight,
  flow,
  generateApp
} = core;

// let options

let createServer = options => {
  //initiate the options
  //options = opt;

  let App = generateApp(uWS.App())
  App(options)
}

module.exports = {
  auth,
  createServer,
  crud,
  orm,
  streamFile,
  utils: {
    cors,
    color: c,
    flow,
    flatten,
    preFlight
  }
};
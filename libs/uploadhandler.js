const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const os = require('os')
const utf8 = require('utf8')

let getValueinsideQoute = (str) => {
  try {
    let regExp = /\"([^\"]+)/g
    let value = regExp.exec(str)[1]
    return value
  } catch (e) {
    console.log(e)
    return false
  }
}

let formdataHandler = (callback) => async (context) => {
  //console.log('form-data handler initiated')
  try {
    let set = context.rawdata.split(/------[a-zA-Z0-9--]*/)
    let fields = {}
    let files = []
    let results = set.map(async (content) => {
      if ((content.lenght = 0 || content == '' || content == '\r\n')) return
      let f = content.replace('\r\nContent-Disposition: form-data; ', '')
      let field = f.split('\r\n\r\n')
      if (/filename/.test(field[0])) {
        let mime = field[0].split('\r\n')[1].split(':')[1].replace(' ', '')
        let filename = getValueinsideQoute(field[0].split(';')[1])
        let file = field[1]
        let ext = filename.split('.')[1]
        let tmpFilename = path.join(os.tmpdir(), `${Date.now()}.${ext}`)
        // fs.writeFile(tmpFilename, file, "binary", err => {
        //   if (err) console.log(err);
        // });
        fs.writeFileSync(tmpFilename, file, 'binary')
        files.push({
          mime,
          ext,
          filename,
          tmpFilename,
        })
      } else {
        let key = getValueinsideQoute(field[0])
        try {
          let value = field[1].replace('\r\n', '')
          Object.assign(fields, {
            [key]: value,
          })
          return
        } catch (e) {}
      }
    })

    Promise.all(results).then((complete) => {
      let d = {
        fields,
        files,
      }
      context.data = d
      callback(context)
    })
  } catch (e) {
    console.log('error on Form Handler')
    console.log(e)
  }
}

const isUTF8 = (value) => {
  try {
    let charset = value.split(';')[1].split('=')[1]
    return charset.toLowerCase() == 'utf-8'
  } catch (e) {
    return false
  }
}

let formUrlencodedHandler = (callback) => async (context) => {
  try {
    const headers = context.req.headers

    let result = isUTF8(headers['content-type'])
      ? JSON.parse(utf8.decode(context.rawdata))
      : JSON.parse(context.rawdata)
    context.data = {
      fields: result,
    }
    callback(context)
  } catch (e) {
    console.log(e)
  }
}

let jsonHandler = (callback) => async (context) => {
  const headers = context.req.headers
  try {
    let result = isUTF8(headers['content-type'])
      ? JSON.parse(utf8.decode(context.rawdata))
      : JSON.parse(context.rawdata)
    context.data = {
      fields: result,
    }
    callback(context)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  formUrlencodedHandler,
  formdataHandler,
  jsonHandler,
}

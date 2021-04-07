const fs = require('fs')
const path = require('path')
const os = require('os')
const utf8 = require('utf8')


const generateRandomString = (stringLength)=> {
  let secret = ''
  const set ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < stringLength; i++)
    secret += set.charAt(Math.floor(Math.random() * set.length))
  return secret
}

const formdataHandler = (callback) => async (context) => {
  
  
  try {
    
    const contentType= context.req.headers['content-type']
    const boundary = /boundary=(.*?)$/g.exec(contentType)[1]
    let set = context.rawdata.split(boundary)
    let fields = {}
    let files = []
    let results = set.map(async (content) => {
      if ((content.lenght = 0 || content == '' || content == '\r\n')) return
      let els = content.split(/^--/)

       els.forEach(element=>{
       
     const hasFile = element.match(/filename=/) === null ? false: true
        if (hasFile) {
          const pullFilename =/(filename=")(.*?)\"/g
          const pullFile =/Content-Type:/g
          const mime = /(Content-Type:.*?)(.*?)\r\n/.exec(element)[2].trim()
          const needle = element.search(pullFile)
          const file = element.slice(needle)
          const filename = pullFilename.exec(element)[2]
          const fileset = filename.split('.')
          const ext = fileset[fileset.length -1]
          const tmpFilename = path.join(os.tmpdir(), `${generateRandomString(8)}.${ext}`)
        
          const newfile  =file.split('\n')
          const payload = newfile.splice(0,newfile.length -1).splice(2).join('\n').trim()
           fs.writeFileSync(tmpFilename, payload, 'binary')

        files.push({
          mime,
          ext,
          filename,
          tmpFilename,
        })
        } else if(element.match(/name="/) !== null)  {
          const key =/(name=")(.*?)\"/g.exec(element)[2]
          const value= /(\r\n|\r|\n)(.*?)(\r\n)--/g.exec(element)[2]
          Object.assign(fields, {
                  [key]: value,
                })
                return
      }
       })
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

const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
const os = require('os')
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

let formdataHandler = async context => {
  console.log('from-data handler initiated')
  try {
    let set = context.rawdata.split(/------[a-zA-Z0-9--]*/);
    let fields = {};
    let files = [];
    let results = set.map(async content => {
      if ((content.lenght = 0 || content == "" || content == "\r\n"))
        return;
      let f = content.replace("\r\nContent-Disposition: form-data; ", "");
      let field = f.split("\r\n\r\n");
      if (/filename/.test(field[0])) {
        let mime = field[0]
          .split("\r\n")[1]
          .split(":")[1]
          .replace(" ", "");
        let filename = getValueinsideQoute(field[0].split(";")[1]);
        let file = field[1];
        let ext = filename.split(".")[1];
        let tmpFilename = path.join(os.tmpdir(), `${Date.now()}.${ext}`);
        // fs.writeFile(tmpFilename, file, "binary", err => {
        //   if (err) console.log(err);
        // });
        fs.writeFileSync(tmpFilename, file, "binary")
        files.push({
          mime,
          ext,
          filename,
          tmpFilename
        });
      } else {
        let key = getValueinsideQoute(field[0]);
        let value = field[1].replace("\r\n", "");
        Object.assign(fields, {
          [key]: value
        });
        return;
      }
    });
    Promise.all(results).then(complete => {
      let d = {
        fields,
        files
      };
      context.data = d;
      context.cb(context)
    })
  } catch (e) {
    console.log(e)
  }
}


let formUrlencodedHandler = async context => {
  try {
    let result = querystring.parse(context.rawdata);
    context.data = result;
    context.cb(context);
  } catch (e) {
    console.log(e)
  }

}

module.exports = {
  formUrlencodedHandler,
  formdataHandler
}
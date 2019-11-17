const http = require('http')
const assert = require('assert')
const sever = require('./test-server')
let url = 'http://localhost:9090'
let check = ''

//Basic Test
describe('/', () => {
  it('should return 200', (done) => {
    http.get(url, (res) => {
      assert.equal(200, res.statusCode)
      done()
    })
  })
})

//Test staticFileServer
describe('/index.html', () => {
  it('should return 200', (done) => {
    http.get(`${url}/index.html`, (res) => {
      console.log(`${url}/index.html`)
      assert.equal(200, res.statusCode)
      done()
    })
  })
})
describe('/subdir/index.html', () => {
  it('should return 200', (done) => {
    http.get(`${url}/subdir/index.html`, (res) => {
      console.log(`${url}/subdir/index.html`)
      assert.equal(200, res.statusCode)
      done()
    })
  })
})
//Test header
describe('/', () => {
  it('should return text/html', (done) => {
    http.get(url, (res) => {
      assert.equal('text/html', res.headers['content-type'])
      done()
    })
  })
})
// describe('/', () => {
//   it('should return Hello World', (done) => {
//     http.get(url, (res) => {
//       let data = ''
//       res.on('data', (chunk) => {
//         data += chunk
//       })
//       res.on('end', () => {
//         assert.equal('Hello World', data)
//         done()
//       })
//     })
//   })
// })

//URL Query Test
describe('/query?name=john&gender=male', () => {
  it('should return Objects generated from QueryURL', (done) => {
    http.get(url + '/query?name=john&gender=male', (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        assert.equal('{"name":"john","gender":"male"}', data)
        done()
      })
    })
  })
})

//URL Parameter Test
describe('/user/:name', () => {
  it('should return URI Parameter property', (done) => {
    http.get(url + '/user/John', (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        assert.equal('John', data)
        done()
      })
    })
  })
})

//URL Query & Parameter Test
describe('/combi/:name?age=20', () => {
  it('should return both URI Parameter  and Query properties', (done) => {
    http.get(url + '/combi/John?age=20', (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        assert.equal(
          `{"query":{"age":"20"},"parameters":{"name":"John"}}`,
          data
        )
        done()
      })
    })
  })
})

//Route Handling
check = '/a/John'
describe(check, () => {
  it('it should return ' + check, (done) => {
    http.get(url + check, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        assert.equal(check, data)
        done()
      })
    })
  })
})

check = '/a/b'
describe(check, () => {
  it('it should return ' + check, (done) => {
    http.get(url + check, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        assert.equal(check, data)
        done()
      })
    })
  })
})

check = '/a/b/c'
describe(check, () => {
  it('it should return ' + check, (done) => {
    http.get(url + check, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        assert.equal(check, data)
        done()
      })
    })
  })
})

check = '/a'
describe(check, () => {
  it('it should return ' + check, (done) => {
    http.get(url + check, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        assert.equal(check, data)
        done()
      })
    })
  })
})

describe('/blahblah', () => {
  it('it should 404', (done) => {
    try {
      http.get('/blahblah', (res) => {
        done()
      })
    } catch (e) {
      assert.equal('Invalid URL: /blahblah', e.message)
      done()
    }
  })
})

//StreamFile Check
describe('/public/test.txt', () => {
  it('should return test.txt file content "Hello World"', (done) => {
    http.get(url + '/public/test.txt', (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        assert.equal('Hello World', data)
        done()
      })
    })
  })
})

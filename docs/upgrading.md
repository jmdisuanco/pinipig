## ** Breaking Changes for updates from 0.4.0 to 1.0.0 **

1. The res and req methods are now inside the context object
2. query and data objects are in data objects

this is how it looks like

```javascript
context = {
  res: res,
  req: req,
  data: dataObjectHere,
}
```

If you are coming from lower version this is how you update your routes methods

```javascript
//from this
let HelloWorld = (req, res) => {
  console.log('helloWorld')
  res.setHeader('Content-Type', 'text/html')
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('Working') //write a response to the client
  res.end() //end the response
}

//to this
let HelloWorld = context => {
  let res = context.res // <--- assign this
  console.log('helloWorld')
  context.res.setHeader('Content-Type', 'text/html') //<-- you can have it like this
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('Working') //write a response to the client
  res.end() //end the response
}

//another example
//from this below version 1
var Query = (req, res, query) => {
  console.log('Query')
  res.setHeader('Content-Type', 'text/html')
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('<H1>Hello ' + query.name + '</H1>') //write a response to the client
  res.end() //end the response
}

//to this
var Query = context => {
  let res = context.res
  let query = context.data
  console.log('Query')
  res.setHeader('Content-Type', 'text/html')
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write('<H1>Hello ' + query.name + '</H1>') //write a response to the client
  res.end() //end the response
}
```

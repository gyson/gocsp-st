
# gocsp-st

Stack trace for thunk, promise, callback, etc

## Deprecated

It's functionality is built-in for [gocsp/thunk](https://github.com/gyson/gocsp/doc/thunk.md).

### Usage

```js
var co = require('co')
var fs = require('co-fs')
var st = require('gocsp-st'), st.trace = true

co(function* () {
    try {
        yield fs.readFile('No exist file')
    } catch (err) {
        console.log('w/o st:')
        console.log(err.stack)
    }
    console.log('\n=================================\n')
    try {
        yield st(fs.readFile('No exist file'))
    } catch (err) {
        console.log('w/ st:')
        console.log(err.stack)
    }
})()
```

will have following output:

```
$ node --harmony example/co.js
w/o st:
Error: ENOENT, open 'No exist file'
    at Error (native)

=================================

w/ st:
Error: ENOENT, open 'No exist file'
    at Error (native)

---------------------

Error
    at st (/Users/yunsong/Projects/node_modules/gocsp-st/index.js:20:17)
    at /Users/yunsong/Projects/node_modules/gocsp-st/example/co.js:20:15
    at GeneratorFunctionPrototype.throw (native)
    at next (/Users/yunsong/Projects/node_modules/gocsp-st/node_modules/co/index.js:65:26)
    at /Users/yunsong/Projects/node_modules/gocsp-st/node_modules/co/index.js:93:18
    at /Users/yunsong/Projects/node_modules/gocsp-st/node_modules/co-fs/node_modules/thunkify/index.js:28:12
    at fs.js:224:20
    at Object.oncomplete (fs.js:93:15)
```

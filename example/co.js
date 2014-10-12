
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

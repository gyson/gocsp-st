
var fs = require('fs')
var st = require('..')

function wrap(cb) {
    fs.readFile('no/exist', st.cb(function (err, data) {
        if (err) { return cb(err) }
    }))
}

wrap(st.cb(function (err, data) {
    if (err) throw err
}))

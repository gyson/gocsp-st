
var st = require('..')
var co = require('gocsp-co')
var thunk = require('gocsp-thunk')

co.spawn(function* () {
    yield st(thunk(function (cb) {
        setTimeout(function () {
            cb(new Error('TEST'))
        }, 50)
    }))
})

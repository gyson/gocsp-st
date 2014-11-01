
module.exports = st

var thunk = require('gocsp-thunk')

// some smart way to detect trace ?
// e.g. use --st ?
st.trace = true

function attach(err, stack) {
    if (err && typeof err.stack === 'string') {
        err.stack += '\n\n---------------------\n\n' + stack
    }
    return err
}

// awaitable: promise, thunk, callbacks
// yield st(thunkFunction)
// yield st(new Promise())
function st(awaitable) {
    if (!st.trace) { return awaitable }

    var stack = new Error().stack

    // promise
    if (awaitable && typeof awaitable.catch === 'function') {
        return awaitable.catch(function (error) {
            throw attach(error, stack)
        })
    }
    // thunk or callback
    if (typeof awaitable === 'function') {
        return thunk(function (cb) {
            awaitable(function (err, data) {
                cb(attach(err, stack), data)
            })
        })
    }
    throw new Error(awaitable + ' must be promise or thunk')
}

// fs.readFile('/path/to/file', st.cb(function (err, data) {
//     if (err) { return cb(err) }
// }))

st.cb = function (callback) {
    if (!st.trace) { return callback }

    var stack = new Error().stack

    return function (err) {
        var args = [].slice.call(arguments)
        args[0] = attach(err, stack)
        callback.apply(this, args)
    }
}

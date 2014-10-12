
// yield st((res, rej) => fs.exists('filename', res))
// yield st(cb => client.inc('abc', cb))
// yield st(new Promise())

module.exports = st

// some smart way to detect trace ?
// e.g. use --st ?
st.trace = true

function attach(err, stack) {
    if (err && typeof err.stack === 'string') {
        err.stack += '\n\n---------------------\n\n' + stack
    }
    return err
}

function st(arg) {
    if (!st.trace) { return arg }

    var stack = new Error().stack

    if (typeof arg === 'function') {
        return function (x, y) {
            // x === callback
            if (arguments.length === 1) {
                var callback = x
                return arg(function (err, data) {
                    callback(attach(err, stack), data)
                })
            }
            // x === resolve, y === reject
            if (arguments.length === 2) {
                var resolve = x
                var reject = y
                return arg(resolve, function (err) {
                    reject(attach(err, stack))
                })
            }
            panic(new Error('Invalid number of argument'))
        }
    }
    if (arg && typeof arg['catch'] === 'function') {
        return arg['catch'](function (error) {
            throw attach(error, stack)
        })
    }
    throw new Error('invalid arguments')
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

function panic(err) {
    setImmediate(function () {
        throw err
    })
}

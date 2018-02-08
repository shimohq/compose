'use strict'

const co = require('co')
const isGeneratorFn = require('is-generator-fn')

function compose (middleware) {
  return function (ctx) {
    return Promise.resolve().then(function () {
      let index = -1

      return dispatch(0)

      function dispatch (i) {
        if (i <= index) {
          throw new Error('next() called multiple times')
        }

        index = i

        let fn = middleware[i]
        let ret

        if (typeof fn === 'function') {
          if (isGeneratorFn(fn)) {
            fn = co.wrap(fn)

            const next = function * () {
              return yield dispatch(i + 1)
            }

            next[Symbol.iterator] = function () {
              return next()
            }

            ret = fn.call(ctx, next)
          } else {
            ret = fn.call(ctx, function () { return dispatch(i + 1) })
          }
        }

        return Promise.resolve(ret)
      }
    })
  }
}

module.exports = compose

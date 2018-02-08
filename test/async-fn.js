'use strict'

const test = require('tape')
const compose = require('..')

test('should work', t => {
  t.plan(1)

  const result = []

  compose([
    function * (next) {
      result.push(1)
      yield * next
      result.push(8)
    },
    function * (next) {
      result.push(2)
      yield * next()
    },
    function * (next) {
      result.push(3)
      yield next
    },
    function * (next) {
      result.push(4)
      yield next()
    },
    async (next) => {
      result.push(5)
      await next()
      result.push(7)
    },
    (next) => {
      next().then(() => result.push(6))
    }
  ])()
    .then(() => t.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8]))
    .catch(err => t.fail(err))
})

test('disallow to call next() multiple times', t => {
  t.plan(1)

  compose([
    async function (next) {
      await next()
      await next()
    }
  ])().catch(err => t.equal(err.message, 'next() called multiple times'))
})

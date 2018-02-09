'use strict'

const semver = require('semver')
const test = require('tape')
const isPromise = require('p-is-promise')
const compose = require('..')

test('compose is function', t => {
  t.true(typeof compose === 'function')
  t.end()
})

test('compose() returns a function', t => {
  t.true(typeof compose() === 'function')
  t.end()
})

test('compose()() returns a promise', t => {
  const ret = compose([(next) => next()])()
  t.true(isPromise(ret))
  t.end()
})

test('compose()() returns final result', t => {
  t.plan(1)

  compose([() => 'shimo'])().then(result => t.equal(result, 'shimo'))
})

test('compose()(ctx) pass ctx as this', t => {
  t.plan(2)

  const ctx = {}

  compose([
    function * (next) {
      t.equal(this, ctx)
      yield next
    },
    function () {
      t.equal(this, ctx)
    }
  ])(ctx)
})

test('next() returns a promise', t => {
  t.plan(1)
  compose([
    (next) => {
      t.true(isPromise(next()))
    }
  ])()
})

require('./generator-fn')

if (semver.gt(process.versions.node, '7.5.0')) {
  require('./async-fn')
}

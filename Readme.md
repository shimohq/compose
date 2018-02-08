# bay-compose

Middleware composition utility for Bay.

[![NPM version][npm-image]][npm-url]

Like `koa-compose@2`, but:

- returns the final value.
- supports async function.
- `next` is a yieldable function, e.g. `yield * next` equals `yield * next()`.

```
npm i bay-compose
```

```js
const compose = require('bay-compose')

compose([
  function * (next) {
    yield next
  },
  function * (next) {
    yield next()
  },
  function * (next) {
    yield * next
  },
  function * (next) {
    yield * next()
  },
  async function (next) {
    await next()
  },
  function (next) {
    next().then(doSomeJob)
  }
])(context)
```

[npm-url]: https://npmjs.org/package/bay-compose
[npm-image]: http://img.shields.io/npm/v/bay-compose.svg?style=flat-square

# stream-lite
<h2>An extremely small, and simple<br />functional reactive programming library</h2>

**The power of streams, without the overhead:**

- Extremely small.
- Familiar interface (mostly replicating RxJS's API)
- Modular. Add as little or as much functionality as you want
- Lazy streams (only active once subscribed to)
- More than 30 operators and factories available

[![npm](https://img.shields.io/npm/v/stream-lite.svg?style=flat-square)](http://npm.im/stream-lite)
[![travis build](https://img.shields.io/travis/pshev/stream-lite.svg?style=flat-square)](https://travis-ci.org/pshev/stream-lite)
[![codecov coverage](https://img.shields.io/codecov/c/github/pshev/stream-lite.svg?style=flat-square)](https://codecov.io/gh/pshev/stream-lite)
[![MIT License](https://img.shields.io/npm/l/stream-lite.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

---

## Installation

#### Using NPM
```text
npm install --save stream-lite
```

#### Using Yarn
```text
yarn add stream-lite
```

## Getting Started

The following guide assumes you use ES2015 but you don't have to.

### Import what you need

The `stream-lite` module encourages shipping only the scripts that you will actually use. 
So first you will need to tell `stream-lite` which operators and factories you need.

##### Import [everything available](https://github.com/pshev/stream-lite/blob/master/src/add/all.js#L1-L99):
![size](https://img.shields.io/badge/gzip%20size-2KB-brightgreen.svg?style=flat-square)
```js
// adds more than 30 operators and factories
import 'stream-lite/add/all' 
```

##### Import [commonly used pack](https://github.com/pshev/stream-lite/blob/master/src/add/common.js#L1-L99):
![size](https://img.shields.io/badge/gzip%20size-1.26KB-brightgreen.svg?style=flat-square)
```js
// adds ~15 most common operators and factories
import 'stream-lite/add/common' 
```

##### Import only what you need:
```js
import 'stream-lite/add/factories/of' 
import 'stream-lite/add/factories/fromPromise' 

import 'stream-lite/add/operators/map' 
import 'stream-lite/add/operators/filter'
import 'stream-lite/add/operators/switchMap' 
import 'stream-lite/add/operators/combineLatest' 
```

### Usage

Once you've done that you can start hacking! 🙌
```js
import Stream from 'stream-lite'

Stream.of(42).subscribe(x => console.log('hurrah!', x))
```

## License
MIT
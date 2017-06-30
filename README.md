<p align="center" style="margin-top: 15px">
	<img alt="stream-lite" title="Stream lite" src="https://cldup.com/KjEcd2jTaI.png" width="550">
</p>
<p align="center">Extremely small, and simple reactive programming library.</p>

--- 

**The power of streams, without the overhead:**

- [Extremely small](#import-what-you-need).
- Familiar interface (mostly replicating RxJS's API)
- Modular. Add as little or as much functionality as you want
- Lazy streams (only active once subscribed to)
- More than 40 operators and factories available

[![npm](https://img.shields.io/npm/v/stream-lite.svg?style=flat-square)](http://npm.im/stream-lite)
[![travis build](https://img.shields.io/travis/pshev/stream-lite.svg?style=flat-square)](https://travis-ci.org/pshev/stream-lite)
[![dependencies](https://img.shields.io/david/pshev/stream-lite.svg?style=flat-square)](https://david-dm.org/pshev/stream-lite)
[![codecov coverage](https://img.shields.io/codecov/c/github/pshev/stream-lite.svg?style=flat-square)](https://codecov.io/gh/pshev/stream-lite)
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

### <a id="import-what-you-need"></a> Import what you need

The `stream-lite` module encourages shipping only the scripts that you will actually use. <br/>
The core library includes only the most bare bones functionality. If you just import it like so:
```js
import Stream from 'stream-lite'
```
The only factory you will get will be [`create`](#create). 
The streams that factory produces will have no operators on them and the only methods they'll have will be the basic `next`, `error`, and `complete`.<br/>
This core is just under **1KB** gzipped.

You will probably want more functionality than that, so you will need to tell `stream-lite` which operators and factories you need. Here are the ways to do that:

##### Import [commonly used pack](https://github.com/pshev/stream-lite/blob/master/src/add/common.js#L1-L99):
This pack includes a dozen most common operators and a few factories and will only cost you about **1.6KB** gzipped. 😍
```js
import 'stream-lite/add/common' 
```

##### Import only what you need:
Bring in only the exact operators and factories you will use. 
```js
import 'stream-lite/add/factories/of' 
import 'stream-lite/add/factories/fromPromise' 

import 'stream-lite/add/operators/map' 
import 'stream-lite/add/operators/filter'
import 'stream-lite/add/operators/switchMap' 
import 'stream-lite/add/operators/combineLatest' 
```

##### Import [everything available](https://github.com/pshev/stream-lite/blob/master/src/add/all.js#L1-L99):
If for some reason you feel the need to import all available operators and factories, that option is also available.<br/>
This pack will include all `stream-lite` has got: about 40 operators and factories. This will make your app heavier by about **2.9KB** gzipped.
```js
import 'stream-lite/add/all' 
```

### Usage

Once you've done that you can start hacking! 🙌
```js
import Stream from 'stream-lite'

Stream.of(42).subscribe(x => console.log('hurrah!', x))
```

## API

The vast majority of factories and operators replicate the API of RxJS, so most links will point you to RxJS documentation.<br/>
There are also some that don't exist in RxJS or ones with a different API. Those are marked with an astrix (*) and their documentation you will find below.<br/>
Operators marked with 🚩 are also available as statics.

#### Factories
- [`create`](#create)*
- [`of`](https://www.learnrxjs.io/operators/creation/of.html)
- [`empty`](https://www.learnrxjs.io/operators/creation/empty.html)
- [`never`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/never.md)
- [`throw`](https://www.learnrxjs.io/operators/creation/throw.html)
- [`fromArray`](#fromArray)*
- [`fromEvent`](https://www.learnrxjs.io/operators/creation/fromevent.html)
- [`fromPromise`](https://www.learnrxjs.io/operators/creation/frompromise.html)
- [`interval`](https://www.learnrxjs.io/operators/creation/interval.html)
- [`range`](https://www.learnrxjs.io/operators/creation/range.html)

#### Methods and Operators
- [`subscribe`](#subscribe)*
- [`map`](https://www.learnrxjs.io/operators/transformation/map.html)
- [`mapTo`](https://www.learnrxjs.io/operators/transformation/mapto.html)
- [`filter`](https://www.learnrxjs.io/operators/filtering/filter.html)
- [`scan`](#scan)*
- [`pluck`](https://www.learnrxjs.io/operators/transformation/pluck.html)
- [`single`](https://www.learnrxjs.io/operators/filtering/single.html)
- [`first`](https://www.learnrxjs.io/operators/filtering/first.html)
- [`last`](https://www.learnrxjs.io/operators/filtering/last.html)
- [`every`](https://www.learnrxjs.io/operators/conditional/every.html)
- [`do`](https://www.learnrxjs.io/operators/utility/do.html)
- [`pairwise`](https://www.learnrxjs.io/operators/combination/pairwise.html)
- [`delay`](https://www.learnrxjs.io/operators/utility/delay.html)
- [`debounce`](https://www.learnrxjs.io/operators/filtering/debounce.html)
- [`debounceTime`](https://www.learnrxjs.io/operators/filtering/debouncetime.html)
- [`throttle`](https://www.learnrxjs.io/operators/filtering/throttle.html)
- [`throttleTime`](https://www.learnrxjs.io/operators/filtering/throttletime.html)
- [`distinctUntilChanged`](https://www.learnrxjs.io/operators/filtering/distinctuntilchanged.html)
- [`mergeMap`](#flatMap)*
- [`flatMap`](#flatMap)*
- [`switchMap`](https://www.learnrxjs.io/operators/transformation/switchmap.html)
- [`concatMap`](https://www.learnrxjs.io/operators/transformation/concatmap.html)
- [`concatMapTo`](https://www.learnrxjs.io/operators/transformation/concatmapto.html)
- [`catch`](https://www.learnrxjs.io/operators/error_handling/catch.html)
- [`partition`](https://www.learnrxjs.io/operators/transformation/partition.html)
- [`concat`](https://www.learnrxjs.io/operators/combination/concat.html) 🚩
- [`merge`](https://www.learnrxjs.io/operators/combination/merge.html) 🚩
- [`combine`](#combine)* 🚩
- [`combineLatest`](https://www.learnrxjs.io/operators/combination/combinelatest.html) 🚩
- [`startWith`](https://www.learnrxjs.io/operators/combination/startwith.html)
- [`skip`](https://www.learnrxjs.io/operators/filtering/skip.html)
- [`skipUntil`](https://www.learnrxjs.io/operators/filtering/skipuntil.html)
- [`skipWhile`](https://www.learnrxjs.io/operators/filtering/skipwhile.html)
- [`ignoreElements`](https://www.learnrxjs.io/operators/filtering/ignoreelements.html)
- [`take`](https://www.learnrxjs.io/operators/filtering/take.html)
- [`takeUntil`](https://www.learnrxjs.io/operators/filtering/takeuntil.html)
- [`takeWhile`](https://www.learnrxjs.io/operators/filtering/takewhile.html)
- [`withLatestFrom`](https://www.learnrxjs.io/operators/combination/withlatestfrom.html)
- [`withValue`](#withValue)*

## 

### <a id="subscribe"></a> subscribe

Takes in three callbacks in this following order: `next`, `error`, `complete`.<br/>
Passing a subscription object with the next, error, and complete keys is currently not supported.

### <a id="create"></a> create

This is the only thing that is included in the core object exported from `stream-lite`.
Most use-cases for creating a stream involve calling other factory functions, like `fromEvent` or `fromPromise`, etc.<br/>
Those are all abstractions on top of the `create` factory. Usually you want to use those.
However, sometimes you may need more control and the way you achieve that in `stream-lite` is different from `RxJS`.

#### Creating a stream with a producer

A Producer is a simple JavaScript object with `start` and `stop` functions. `start` function will be called when the first subscriber subscribes to it.
`stop` function will be called when the last subscriber unsubscribes or the stream completes or it errors.
Here is an example of a producer that is used inside the `interval` factory (except with `step` parameter hard-coded):
```js
const producer = {
	counter: 0,
	id: 0,
	start: function(consumer) {
		this.id = setInterval(() => consumer.next(this.counter++), 1000)
	},
	stop: function() {
		clearInterval(this.id)
	}
}
```
Armed with that producer we can now easily create a new stream:
<br/>
```js
const myIntervalStream = Stream.create(producer) 
```
When subscribed to it will start emitting values every second.

#### Creating a stream without a producer

Sometimes you just want to create an empty stream and manually push values into it.
You can achieve this functionality by calling `create` with no parameters:
<br/>
```js
const manuallyControlledStream = Stream.create() 

manuallyControlledStream.subscribe(x => console.log(x))

manuallyControlledStream.next(1) // logs 1
manuallyControlledStream.next(2) // logs 2
```
This is sort of similar to how you would use RxJs's Subject.

### <a id="fromArray"></a> fromArray

Equivalent to calling RxJS's [`from`](https://www.learnrxjs.io/operators/creation/from.html) with an array.

### <a id="scan"></a> scan

Mostly equivalent to calling RxJS's [`scan`](https://www.learnrxjs.io/operators/transformation/scan.html) except currently it requires an initial value parameter.

### <a id="flatMap"></a> flatMap

Alias: `mergeMap`.

Equivalent to RxJS's [`flatMap`](https://www.learnrxjs.io/operators/transformation/mergemap.html) without the support for an optional 3rd parameter `concurrent`.

### <a id="combine"></a> combine

Simply an alias for [`combineLatest`](https://www.learnrxjs.io/operators/combination/combinelatest.html).

### <a id="withValue"></a> withValue

Allows to emit an extra parameter in addition to one emitted from source stream.<br/>
```js
Stream.of(4).withValue(x => x / 2)
	.subscribe(x => console.log(x)) // logs [4, 2]
```

## License
MIT
<p align="center" style="margin-top: 15px">
  <img alt="stream-lite" title="Stream lite" src="https://cldup.com/KjEcd2jTaI.png" width="550">
</p>
<p align="center">
  <strong>The power of streams, without the overhead.</strong>
  <br>
  Extremely small and simple reactive programming library.
  <br>
  <br>
  <a href="http://npm.im/stream-lite"><img src="https://img.shields.io/npm/v/stream-lite.svg?style=flat-square" alt="npm"></a>
  <a href="https://travis-ci.org/pshev/stream-lite"><img src="https://img.shields.io/travis/pshev/stream-lite.svg?style=flat-square" alt="travis build"></a>
  <a href="https://david-dm.org/pshev/stream-lite"><img src="https://img.shields.io/david/pshev/stream-lite.svg?style=flat-square" alt="dependencies"></a>
  <a href="https://codecov.io/gh/pshev/stream-lite"><img src="https://img.shields.io/codecov/c/github/pshev/stream-lite.svg?style=flat-square" alt="codecov coverage"></a>
  <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square" alt="semantic-release"></a>
  <a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square" alt="Commitizen friendly"></a>
</p>

## ✨ Features:
- [Extremely small](#size).
- Familiar interface (mostly replicating RxJS's API)
- Modular. Add as little or as much functionality as you want
- Lazy streams (only active once subscribed to)
- More than 50 operators and factories available

## 🔧 Installation

Assuming you use [npm](https://www.npmjs.com/) as your package manager:
```text
npm install --save stream-lite
```
This package includes both a [CommonJS](https://nodejs.org/docs/latest/api/modules.html) and [ES2015](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) based modules.<br />
You can use them from [Node](https://nodejs.org/en/) environment or if you are building for the browser you can use a module bundler like [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/), or [Rollup](http://rollupjs.org).<br/>
If you don't use a module bundler, it's also fine. 
The `stream-lite` npm package includes precompiled production and development UMD builds in the `umd` folder. 
They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. For example, you can drop a UMD build as a `<script>` tag on the page. The UMD builds make `stream-lite` available as a `window.Stream` global variable and include all the functionality.

## 📦🔨 Import and Usage
The following guide assumes you use ES2015+ but you don't have to.<br />
There are a few different ways of importing the functionality that you need.

To import the entire set of functionality:
```js
import Stream from 'stream-lite/Stream'

Stream
  .of(1,2,3)
  .map(x => x * 2)
  .subscribe(x => console.log(x))
```
However the `stream-lite` module encourages shipping only the scripts that you will actually use. <br/>
One way of doing that is to add to Stream's prototype only the methods you actually need:
```js
import Stream from 'stream-lite'
import 'stream-lite/add/statics/of'
import 'stream-lite/add/operators/map'

Stream
  .of(1,2,3)
  .map(x => x * 2)
  .subscribe(x => console.log(x))
```
To not add static methods to Stream, you can import them as pure functions:
```js
import {of} from 'stream-lite/statics'
import 'stream-lite/add/operators/map'

of(1,2,3)
  .map(x => x * 2)
  .subscribe(x => console.log(x))
```
To take this one step further and avoid patching the Stream's prototype altogether, you can use `pipeable operators`.<br/>
If you are not familiar with pipeable operators you can learn about them [here](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md).<br/>
```js
import {of} from 'stream-lite/statics'
import {map, filter} from 'stream-lite/operators'

of(1,2,3).pipe(
  filter(x => x % 2 === 0),
  map(x => x * 2)
)
  .subscribe(x => console.log(x))
```
The `stream-lite` core also provides a pipeable `subscribe` for your convenience.<br/> 
So you can bring the subscribe method inside your pipe and write the code above like so:
```js
import {subscribe} from 'stream-lite'
import {of} from 'stream-lite/statics'
import {map, filter} from 'stream-lite/operators'

of(1,2,3).pipe(
  filter(x => x % 2 === 0),
  map(x => x * 2),
  subscribe(x => console.log(x))
)
```
Or if you use the proposed JavaScript [`pipe operator`](https://github.com/tc39/proposal-pipeline-operator):
```js
import {subscribe} from 'stream-lite'
import {of} from 'stream-lite/statics'
import {map, filter} from 'stream-lite/operators'

of(1,2,3)
  |> filter(x => x % 2 === 0)
  |> map(x => x * 2)
  |> subscribe(x => console.log(x))
```
> Please note: This additional syntax requires [transpiler support](https://www.npmjs.com/package/babel-plugin-transform-pipeline-operator).

## <a id="size"></a> 🎉 Size
The `stream-lite` package is built to bring as little overhead to your project as possible.<br/>
##### core
The core of the library includes the `create` function and a few prototype methods, like `subscribe` and `pipe`. <br/>
This core is under **900B** gzipped.
<br/>
##### common
A common usage will probably include around 15 most common methods and operators, which should bring about **1.5KB** to your app if you use tree-shaking. 😍
<br/>
##### everything
If for some reason you feel the need to import all available operators and factories, that option is also available.<br/>
That includes more than 50 operators and factories, and will make your app heavier by about **3.3KB** gzipped.



## 📋 API

The vast majority of factories and operators are too similar to the API of RxJS, so most links will point you to RxJS documentation.<br/>
However there are some that don't exist in RxJS or ones with a different API. Those are marked with an astrix (*) and their documentation you will find below.<br/>
Operators marked with 🚩 are also available as statics.

#### Factories
- [`create`](#create)*
- [`of`](https://www.learnrxjs.io/operators/creation/of.html)
- [`empty`](https://www.learnrxjs.io/operators/creation/empty.html)
- [`never`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/never.md)
- [`error`](#error)*
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
- [`defaultIfEmpty`](https://www.learnrxjs.io/operators/conditional/defaultifempty.html)
- [`tap`](https://www.learnrxjs.io/operators/utility/do.html)
- [`pairwise`](https://www.learnrxjs.io/operators/combination/pairwise.html)
- [`delay`](https://www.learnrxjs.io/operators/utility/delay.html)
- [`buffer`](https://www.learnrxjs.io/operators/transformation/buffer.html)
- [`bufferWhen`](https://www.learnrxjs.io/operators/transformation/bufferwhen.html)
- [`bufferCount`](https://www.learnrxjs.io/operators/transformation/buffercount.html)
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
- [`catchError`](https://www.learnrxjs.io/operators/error_handling/catch.html)
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

You can call it in two different ways:
<br/>
Either passing three callbacks in this following order: `next`, `error`, `complete`.
```js
import {of} from 'stream-lite/statics'

of(1, 2, 3).subscribe(
  x => console.log(x),
  err => console.error("There's an error!", err),
  () => console.log("We're done")
)
```
Or passing a subscription object with the `next`, `error`, `complete` functions as keys.
```js
import {of} from 'stream-lite/statics'

of(1, 2, 3).subscribe({
  next: x => console.log(x),
  error: err => console.error("There's an error!", err),
  complete: () => console.log("We're done")
})
```
You can also use a pipeable version of `subscribe`: 
```js
import {subscribe} from 'stream-lite'
import {of} from 'stream-lite/statics'
import {map} from 'stream-lite/operators'

of(1,2,3).pipe(
  map(x => x * 2),
  subscribe(x => console.log(x))
)
```

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
import {create} from 'stream-lite'

const myIntervalStream = create(producer) 
```
When subscribed to it will start emitting values every second.

#### Creating a stream without a producer

Sometimes you just want to create an empty stream and manually push values into it.
You can achieve this functionality by calling `create` with no parameters:
<br/>
```js
import {create} from 'stream-lite'

const manuallyControlledStream = create() 

manuallyControlledStream.subscribe(x => console.log(x))

manuallyControlledStream.next(1)
manuallyControlledStream.next(2)
// logs 1, 2
```
This is sort of similar to how you would use RxJs's Subject.

### <a id="fromArray"></a> fromArray

Equivalent to calling RxJS's [`from`](https://www.learnrxjs.io/operators/creation/from.html) with an array.

### <a id="error"></a> error

Same as RxJS's [`_throw`](https://www.learnrxjs.io/operators/creation/throw.html) but with a friendlier name.

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
import {subscribe} from 'stream-lite'
import {of} from 'stream-lite/statics'
import {withValue} from 'stream-lite/operators'

of(4)
  |> withValue(x => x / 2)
  |> subscribe(x => console.log(x)) // logs [4, 2]
```

## 🙏 License
MIT
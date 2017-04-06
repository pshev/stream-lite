import '../factories/fromPromise'
import {baseCreate, baseNext, baseComplete, proto, statics} from '../../core'

proto.flatMap = function flatMap(fn, resultSelector) {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let outerIndex = 0
  let subscriptions = []
  let sourceStreamHasCompleted
  let numberOfCompletedNestedStreams = 0
  const toStream = s => s.then ? statics.fromPromise(s) : s

  return baseCreate({
    next(outerValue) {
      const subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
      subscriptions.push(subscription)
    },
    stop() {
      subscriptions.forEach(s => s.unsubscribe())
      outerIndex = 0
      subscriptions = []
      sourceStreamHasCompleted = false
      numberOfCompletedNestedStreams = 0
    },
    complete() {
      sourceStreamHasCompleted = true
      if (numberOfCompletedNestedStreams === subscriptions.length)
        baseComplete(this)
    },
    subscribeToInner({outerValue, outerIndex}) {
      let innerIndex = 0
      return toStream(fn(outerValue, outerIndex)).subscribe(
        innerValue => this.tryNext(resultSelector.bind(this, outerValue, innerValue, outerIndex, innerIndex++)),
        this.error.bind(this),
        this.innerStreamComplete.bind(this)
      )
    },
    innerStreamComplete() {
      numberOfCompletedNestedStreams++
      sourceStreamHasCompleted && this.complete()
    },
    tryNext(fn) {
      let result
      try {
        result = fn()
      } catch (e) {
        this.error(e)
      }
      baseNext(this, result)
    }
  }, this)
}

proto.mergeMap = proto.flatMap

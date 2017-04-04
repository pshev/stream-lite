import '../factories/fromPromise'
import {baseCreate, baseNext, baseComplete, proto, statics} from '../../core'

proto.flatMap = function flatMap(fn, resultSelector) {
  resultSelector = resultSelector || ((valueFromSource, valueFromNestedStream) => valueFromNestedStream)
  let outerIndex = 0
  let subscriptions = []
  let sourceStreamHasCompleted
  let numberOfCompletedNestedStreams = 0

  return baseCreate({
    next: function(outerValue) {
      const nested = fn(outerValue, outerIndex)
      const nestedStream = nested.then ? statics.fromPromise(nested) : nested

      const subscription = subscribeToNested.call(this, nestedStream, outerValue, outerIndex)

      outerIndex++

      subscriptions.push(subscription)
    },
    streamDeactivated: function() {
      subscriptions.forEach(s => s.unsubscribe())
    },
    complete: function() {
      sourceStreamHasCompleted = true
      if (numberOfCompletedNestedStreams === subscriptions.length)
        baseComplete(this)
    }
  }, this)

  function subscribeToNested(nestedStream, outerValue, outerIndex) {
    let innerIndex = 0
    return nestedStream.subscribe(
      innerValue => {
        baseNext(this, resultSelector(outerValue, innerValue, outerIndex, innerIndex))
        innerIndex++
      },
      this.error.bind(this),
      () => {
        numberOfCompletedNestedStreams++
        if (sourceStreamHasCompleted)
          this.complete()
      }
    )
  }
}

proto.mergeMap = proto.flatMap

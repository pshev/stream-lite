import {baseCreate, baseNext, baseComplete, proto, statics} from '../../core'

proto.switchMap = function switchMap(fn, resultSelector) {
  resultSelector = resultSelector || ((valueFromSource, valueFromNestedStream) => valueFromNestedStream)
  let subscription
  let outerIndex = 0
  let sourceStreamHasCompleted
  let nestedStreamHasCompleted

  return baseCreate({
    next: function(outerValue) {

      subscription && subscription.unsubscribe()

      const nested = fn(outerValue, outerIndex)
      const nestedStream = nested.then ? statics.fromPromise(nested) : nested

      subscription = subscribeToNested.call(this, nestedStream, outerValue, outerIndex)

      outerIndex++
    },
    streamDeactivated: function() {
      subscription && subscription.unsubscribe()
    },
    complete: function() {
      sourceStreamHasCompleted = true
      if (nestedStreamHasCompleted)
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
        nestedStreamHasCompleted = true
        if (sourceStreamHasCompleted)
          this.complete()
      }
    )
  }
}

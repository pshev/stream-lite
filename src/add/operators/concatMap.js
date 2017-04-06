import '../factories/fromPromise'
import {baseCreate, baseNext, baseComplete, proto, statics} from '../../core'

proto.concatMap = function concatMap(fn, resultSelector) {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let outerIndex = 0
  let subscription
  let streamsToCreate = []
  let innerStreamIsCurrentlyEmitting = false
  let sourceStreamHasCompleted
  const toStream = s => s.then ? statics.fromPromise(s) : s

  return baseCreate({
    next: function(outerValue) {
      if (innerStreamIsCurrentlyEmitting)
        streamsToCreate.push({outerValue, outerIndex: outerIndex++})
      else
        subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
    },
    stop: function() {
      subscription && subscription.unsubscribe()
      outerIndex = 0
      subscription = null
      streamsToCreate = []
      innerStreamIsCurrentlyEmitting = false
      sourceStreamHasCompleted = false
    },
    complete: function() {
      sourceStreamHasCompleted = true
      if (!innerStreamIsCurrentlyEmitting && streamsToCreate.length === 0)
        baseComplete(this)
    },
    subscribeToInner: function({outerValue, outerIndex}) {
      let innerIndex = 0
      innerStreamIsCurrentlyEmitting = true
      return toStream(fn(outerValue, outerIndex)).subscribe(
        innerValue => baseNext(this, resultSelector(outerValue, innerValue, outerIndex, innerIndex++)),
        this.error.bind(this),
        this.innerStreamComplete.bind(this)
      )
    },
    innerStreamComplete: function() {
      innerStreamIsCurrentlyEmitting = false

      if (streamsToCreate.length === 0)
        sourceStreamHasCompleted && baseComplete(this)
      else
        subscription = this.subscribeToInner(streamsToCreate.shift())
    }
  }, this)
}

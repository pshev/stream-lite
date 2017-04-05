import '../factories/fromPromise'
import {baseCreate, baseNext, baseComplete, proto, statics} from '../../core'

proto.concatMapTo = function concatMapTo(innerStream, resultSelector) {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let outerIndex = 0
  let subscription
  let outerEmissionsToHandle = []
  let innerStreamIsCurrentlyEmitting = false
  let sourceStreamHasCompleted
  const toStream = s => s.then ? statics.fromPromise(s) : s

  return baseCreate({
    next: function(outerValue) {
      if (innerStreamIsCurrentlyEmitting)
        outerEmissionsToHandle.push({outerValue, outerIndex: outerIndex++})
      else
        subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
    },
    streamDeactivated: function() {
      subscription && subscription.unsubscribe()
      outerIndex = 0
      subscription = null
      outerEmissionsToHandle = []
      innerStreamIsCurrentlyEmitting = false
      sourceStreamHasCompleted = false
    },
    complete: function() {
      sourceStreamHasCompleted = true
      if (!innerStreamIsCurrentlyEmitting && outerEmissionsToHandle.length === 0)
        baseComplete(this)
    },
    subscribeToInner: function({outerValue, outerIndex}) {
      let innerIndex = 0
      innerStreamIsCurrentlyEmitting = true
      return toStream(innerStream).subscribe(
        innerValue => baseNext(this, resultSelector(outerValue, innerValue, outerIndex, innerIndex++)),
        this.error.bind(this),
        this.innerStreamComplete.bind(this)
      )
    },
    innerStreamComplete: function() {
      innerStreamIsCurrentlyEmitting = false

      if (outerEmissionsToHandle.length === 0)
        sourceStreamHasCompleted && baseComplete(this)
      else
        subscription = this.subscribeToInner(outerEmissionsToHandle.shift())
    }
  }, this)
}

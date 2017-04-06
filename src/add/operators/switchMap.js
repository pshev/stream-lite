import {baseCreate, baseNext, baseComplete, proto, statics} from '../../core'

proto.switchMap = function switchMap(fn, resultSelector) {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let subscription
  let outerIndex = 0
  let sourceStreamHasCompleted
  let nestedStreamHasCompleted
  const toStream = s => s.then ? statics.fromPromise(s) : s

  return baseCreate({
    next: function(outerValue) {
      subscription && subscription.unsubscribe()
      subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
    },
    stop: function() {
      subscription && subscription.unsubscribe()
      subscription = null
      outerIndex = 0
      sourceStreamHasCompleted = false
      nestedStreamHasCompleted = false
    },
    complete: function() {
      sourceStreamHasCompleted = true
      nestedStreamHasCompleted && baseComplete(this)
    },
    subscribeToInner: function({outerValue, outerIndex}) {
      let innerIndex = 0
      return toStream(fn(outerValue, outerIndex)).subscribe(
        innerValue => baseNext(this, resultSelector(outerValue, innerValue, outerIndex, innerIndex++)),
        this.error.bind(this),
        this.innerStreamComplete.bind(this)
      )
    },
    innerStreamComplete: function() {
      nestedStreamHasCompleted = true
      sourceStreamHasCompleted && this.complete()
    }
  }, this)
}

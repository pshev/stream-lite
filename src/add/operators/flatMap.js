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
    next: function(outerValue) {
      const subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
      subscriptions.push(subscription)
    },
    streamDeactivated: function() {
      subscriptions.forEach(s => s.unsubscribe())
    },
    complete: function() {
      sourceStreamHasCompleted = true
      if (numberOfCompletedNestedStreams === subscriptions.length)
        baseComplete(this)
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
      numberOfCompletedNestedStreams++
      sourceStreamHasCompleted && this.complete()
    }
  }, this)
}

proto.mergeMap = proto.flatMap

import {baseCreate, baseNext, baseComplete} from '../internal'
import {toStream} from '../internal/helpers'

export const flatMap = (fn, resultSelector) => stream => {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let outerIndex = 0
  let subscriptions = []
  let sourceStreamHasCompleted
  let numberOfCompletedNestedStreams = 0

  return baseCreate({
    next(outerValue) {
      const subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
      subscriptions.push(subscription)
    },
    onStop() {
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
  }, stream)
}

import {Stream, baseNext, baseComplete} from '../internal'
import {toStream} from '../internal/helpers'
import {_try, ERROR} from '../util/try'

export const flatMap = (fn, resultSelector) => stream => {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let outerIndex = 0
  let subscriptions = []
  let sourceStreamHasCompleted
  let numberOfCompletedNestedStreams = 0

  return Stream({
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
      const inner = _try(this, () => fn(outerValue, outerIndex))
      if (inner === ERROR) return

      return toStream(inner).subscribe(
        innerValue => {
          const result = _try(this, () => resultSelector(outerValue, innerValue, outerIndex, innerIndex++))
          if (result !== ERROR)
            baseNext(this, result)
        },
        this.error.bind(this),
        this.innerStreamComplete.bind(this)
      )
    },
    innerStreamComplete() {
      numberOfCompletedNestedStreams++
      sourceStreamHasCompleted && this.complete()
    }
  }, stream)
}

import {Stream, baseNext, baseComplete} from '../internal'
import {toStream} from '../internal/helpers'
import {_try, ERROR} from '../util/try'

export const switchMap = (fn, resultSelector) => stream => {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let subscription
  let outerIndex = 0
  let sourceStreamHasCompleted
  let nestedStreamHasCompleted

  return Stream({
    next(outerValue) {
      subscription && subscription.unsubscribe()
      subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
    },
    onStop() {
      subscription && subscription.unsubscribe()
      subscription = null
      outerIndex = 0
      sourceStreamHasCompleted = false
      nestedStreamHasCompleted = false
    },
    complete() {
      sourceStreamHasCompleted = true
      nestedStreamHasCompleted && baseComplete(this)
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
      nestedStreamHasCompleted = true
      sourceStreamHasCompleted && this.complete()
    }
  }, stream)
}

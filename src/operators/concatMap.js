import {Stream, baseNext, baseComplete} from '../internal'
import {toStream} from '../internal/helpers'
import {_try, ERROR} from '../util/try'

export const concatMap = (fn, resultSelector) => stream => {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let outerIndex = 0
  let subscription
  let streamsToCreate = []
  let innerStreamIsCurrentlyEmitting = false
  let sourceStreamHasCompleted

  return Stream({
    next(outerValue) {
      if (innerStreamIsCurrentlyEmitting)
        streamsToCreate.push({outerValue, outerIndex: outerIndex++})
      else
        subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
    },
    onStop() {
      subscription && subscription.unsubscribe()
      outerIndex = 0
      subscription = null
      streamsToCreate = []
      innerStreamIsCurrentlyEmitting = false
      sourceStreamHasCompleted = false
    },
    complete() {
      sourceStreamHasCompleted = true
      if (!innerStreamIsCurrentlyEmitting && streamsToCreate.length === 0)
        baseComplete(this)
    },
    subscribeToInner({outerValue, outerIndex}) {
      let innerIndex = 0
      innerStreamIsCurrentlyEmitting = true

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
      innerStreamIsCurrentlyEmitting = false

      if (streamsToCreate.length === 0)
        sourceStreamHasCompleted && baseComplete(this)
      else
        subscription = this.subscribeToInner(streamsToCreate.shift())
    }
  }, stream)
}

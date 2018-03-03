import {baseCreate, baseNext, baseComplete} from '../internal'
import {toStream} from '../internal/helpers'
import {_try, ERROR} from '../util/try'

export const concatMapTo = (innerStream, resultSelector) => stream => {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let outerIndex = 0
  let subscription
  let outerEmissionsToHandle = []
  let innerStreamIsCurrentlyEmitting = false
  let sourceStreamHasCompleted

  return baseCreate({
    next(outerValue) {
      if (innerStreamIsCurrentlyEmitting)
        outerEmissionsToHandle.push({outerValue, outerIndex: outerIndex++})
      else
        subscription = this.subscribeToInner({outerValue, outerIndex: outerIndex++})
    },
    onStop() {
      subscription && subscription.unsubscribe()
      outerIndex = 0
      subscription = null
      outerEmissionsToHandle = []
      innerStreamIsCurrentlyEmitting = false
      sourceStreamHasCompleted = false
    },
    complete() {
      sourceStreamHasCompleted = true
      if (!innerStreamIsCurrentlyEmitting && outerEmissionsToHandle.length === 0)
        baseComplete(this)
    },
    subscribeToInner({outerValue, outerIndex}) {
      let innerIndex = 0
      innerStreamIsCurrentlyEmitting = true
      return toStream(innerStream).subscribe(
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

      if (outerEmissionsToHandle.length === 0)
        sourceStreamHasCompleted && baseComplete(this)
      else
        subscription = this.subscribeToInner(outerEmissionsToHandle.shift())
    }
  }, stream)
}

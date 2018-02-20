import {baseCreate, baseNext, baseComplete} from '../internal'
import {toStream} from '../internal/helpers'

export const concatMap = (fn, resultSelector) => stream => {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let outerIndex = 0
  let subscription
  let streamsToCreate = []
  let innerStreamIsCurrentlyEmitting = false
  let sourceStreamHasCompleted

  return baseCreate({
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
      return toStream(fn(outerValue, outerIndex)).subscribe(
        innerValue => this.tryNext(resultSelector.bind(this, outerValue, innerValue, outerIndex, innerIndex++)),
        this.error.bind(this),
        this.innerStreamComplete.bind(this)
      )
    },
    tryNext(fn) {
      let result
      try {
        result = fn()
      } catch (e) {
        this.error(e)
      }
      baseNext(this, result)
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

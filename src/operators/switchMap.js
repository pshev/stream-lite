import {baseCreate, baseNext, baseComplete} from '../internal'
import {toStream} from '../internal/helpers'

export const switchMap = (fn, resultSelector) => stream => {
  resultSelector = resultSelector || ((outerValue, innerValue) => innerValue)
  let subscription
  let outerIndex = 0
  let sourceStreamHasCompleted
  let nestedStreamHasCompleted

  return baseCreate({
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
      return toStream(fn(outerValue, outerIndex)).subscribe(
        innerValue => this.tryNext(resultSelector.bind(this, outerValue, innerValue, outerIndex, innerIndex++)),
        this.error.bind(this),
        this.innerStreamComplete.bind(this)
      )
    },
    innerStreamComplete() {
      nestedStreamHasCompleted = true
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

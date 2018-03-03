import {Stream, baseNext} from '../internal'

export const skipUntil = innerStream => stream => {
  let subscription
  let shouldEmit = false

  return Stream({
    next(x) {
      if (shouldEmit) {
        baseNext(this, x)
        subscription.unsubscribe()
      }
    },
    onStart() {
      subscription = innerStream.subscribe(
        () => shouldEmit = true,
        this.error.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      shouldEmit = false
      subscription = undefined
    }
  }, stream)
}

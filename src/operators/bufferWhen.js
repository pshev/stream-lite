import {baseNext, baseCreate} from '../internal'
import {toStream} from '../internal/helpers'

export const bufferWhen = fn => stream => {
  let subscription = null
  let buffered = []

  return baseCreate({
    next(x) {
      buffered.push(x)
    },
    onStart() {
      this.subscribeToChild()
    },
    subscribeToChild() {
      subscription && subscription.unsubscribe()
      subscription = toStream(fn()).subscribe(
        _ => {
          baseNext(this, buffered)
          buffered = []
          this.subscribeToChild()
        },
        this.error.bind(this),
        this.complete.bind(this)
      )
    },
    onStop() {
      subscription && subscription.unsubscribe()
      subscription = null
      buffered = []
    }
  }, stream)
}

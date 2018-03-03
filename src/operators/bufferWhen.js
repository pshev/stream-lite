import {baseNext, baseCreate} from '../internal'
import {toStream} from '../internal/helpers'
import {_try, ERROR} from '../util/try'

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

      const inner = _try(this, () => fn())
      if (inner === ERROR) return

      subscription = toStream(inner).subscribe(
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

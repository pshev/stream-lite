import {baseNext, Stream} from '../internal'
import {toStream} from '../util/to-stream'
import {_try, ERROR} from '../util/try'

export const bufferWhen = fn => stream => {
  let subscription = null
  let buffered = []

  return Stream({
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
    },
    dependencies: [stream]
  })
}

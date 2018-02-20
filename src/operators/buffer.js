import {baseNext, baseCreate} from '../internal'
import {toStream} from '../internal/helpers'

export const buffer = innerStream => stream => {
  let subscription = null
  let buffered = []

  return baseCreate({
    next(x) {
      buffered.push(x)
    },
    onStart() {
      subscription = toStream(innerStream).subscribe(
        _ => {
          baseNext(this, buffered)
          buffered = []
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

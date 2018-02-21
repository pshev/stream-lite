import {baseNext, baseCreate} from '../internal'
import {toStream} from '../internal/helpers'

export const throttle = fn => stream => {
  let subscription = null
  let lastValue = null
  let throttling = false
  let shouldEmitWhenChildStreamEmits = false

  return baseCreate({
    next(x) {
      lastValue = x
      if (throttling) {
        shouldEmitWhenChildStreamEmits = true
      } else {
        throttling = true
        this.schedule()
        baseNext(this, x)
      }
    },
    onStop() {
      subscription && subscription.unsubscribe()
      subscription = null
      lastValue = null
      throttling = false
      shouldEmitWhenChildStreamEmits = false
    },
    schedule() {
      subscription && subscription.unsubscribe()

      subscription = toStream(fn(lastValue)).subscribe(
        _ => {
          if (shouldEmitWhenChildStreamEmits) {
            shouldEmitWhenChildStreamEmits = false
            this.schedule()
            baseNext(this, lastValue)
          } else {
            throttling = false
          }
        },
        this.error.bind(this)
      )
    }
  }, stream)
}
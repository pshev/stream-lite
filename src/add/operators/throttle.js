import {proto, baseNext, baseCreate, statics} from '../../core'

proto.throttle = function throttle(fn) {
  let subscription = null
  let lastValue = null
  let throttling = false
  let shouldEmitWhenChildStreamEmits = false
  const toStream = s => s.then ? statics.fromPromise(s) : s

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
    stop() {
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
  }, this, 'throttle')
}

import {proto, baseNext, baseCreate} from '../../core'

proto.throttleTime = function throttleTime(interval) {
  let timeoutId = null
  let lastValue = null
  let throttling = false
  let shouldEmitOnTimeoutComplete = false

  return baseCreate({
    next(x) {
      if (throttling) {
        lastValue = x
        shouldEmitOnTimeoutComplete = true
      } else {
        baseNext(this, x)
        throttling = true
        this.schedule()
      }
    },
    stop() {
      clearTimeout(timeoutId)
      timeoutId = null
      lastValue = null
      throttling = false
      shouldEmitOnTimeoutComplete = false
    },
    schedule() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (shouldEmitOnTimeoutComplete) {
          baseNext(this, lastValue)
          shouldEmitOnTimeoutComplete = false
          this.schedule()
        } else {
          throttling = false
        }
      }, interval)
    }
  }, this, 'throttleTime')
}

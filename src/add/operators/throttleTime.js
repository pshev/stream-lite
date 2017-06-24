import {proto, baseNext, baseCreate} from '../../core'

proto.throttleTime = function throttleTime(interval) {
  let timeoutId = null
  let lastValue = null
  let throttling = false
  let shouldEmitOnTimeoutComplete = false

  return baseCreate({
    next(x) {
      if (throttling) {
        shouldEmitOnTimeoutComplete = true
        lastValue = x
      } else {
        baseNext(this, x)

        throttling = true
        shouldEmitOnTimeoutComplete = false

        timeoutId = setTimeout(() => {
          throttling = false
          if (shouldEmitOnTimeoutComplete)
            baseNext(this, lastValue)
        }, interval)
      }
    },
    stop() {
      clearTimeout(timeoutId)
      timeoutId = null
      lastValue = null
      throttling = false
      shouldEmitOnTimeoutComplete = false
    }
  }, this, 'throttleTime')
}

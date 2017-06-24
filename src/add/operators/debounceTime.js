import {proto, baseNext, baseComplete, baseCreate} from '../../core'

proto.debounceTime = function debounceTime(interval) {
  let timeoutId = null
  let lastValue = null

  return baseCreate({
    next(x) {
      lastValue = x

      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        baseNext(this, lastValue)
      }, interval)
    },
    complete() {
      clearTimeout(timeoutId)
      baseNext(this, lastValue)
      baseComplete(this)
    },
    stop() {
      clearTimeout(timeoutId)
      lastValue = null
      timeoutId = null
    }
  }, this, 'debounceTime')
}

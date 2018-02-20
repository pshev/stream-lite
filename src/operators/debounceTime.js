import {baseNext, baseComplete, baseCreate} from '../internal'

export const debounceTime = interval => stream => {
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
    onStop() {
      clearTimeout(timeoutId)
      lastValue = null
      timeoutId = null
    }
  }, stream)
}

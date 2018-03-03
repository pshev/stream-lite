import {baseNext, baseComplete, Stream} from '../internal'

export const debounceTime = interval => stream => {
  let timeoutId = null
  let lastValue = null

  return Stream({
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
    },
    dependencies: [stream]
  })
}

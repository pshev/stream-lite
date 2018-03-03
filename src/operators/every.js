import {Stream, baseNext, baseComplete} from '../internal'
import {_try, ERROR} from '../util/try'

export const every = (predicate = (() => true)) => stream => {
  let index = 0
  return Stream({
    next(x) {
      const condition = _try(this, () => predicate(x, index))

      if (condition !== ERROR && !condition) {
        baseNext(this, false)
        baseComplete(this)
      }
      index++
    },
    complete() {
      baseNext(this, true)
      baseComplete(this)
    },
    onStop() {
      index = 0
    },
    dependencies: [stream]
  })
}
import {Stream, baseNext} from '../internal'
import {_try, ERROR} from '../util/try'

export const skipWhile = predicate => stream => {
  let index = 0
  let skipping = true

  return Stream({
    next(x) {
      if (!skipping)
        baseNext(this, x)
      else {
        const condition = _try(stream, () => predicate(x, index))

        if (condition !== ERROR && !condition) {
          skipping = false
          baseNext(this, x)
        }
      }
      index++
    },
    onStop() {
      index = 0
      skipping = true
    },
    dependencies: [stream]
  })
}

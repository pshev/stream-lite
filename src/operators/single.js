import {Stream, baseNext} from '../internal'
import {_try, ERROR} from '../util/try'

export const single = (predicate = (() => true)) => stream => {
  let index = 0
  return Stream({
    next(x) {
      const condition = _try(this, () => predicate(x, index))
      if (condition !== ERROR && condition) {
        baseNext(this, x)
        this.complete()
      }
      index++
    },
    onStop() {
      index = 0
    }
  }, stream)
}

import {baseCreate, baseNext,} from '../internal'

export const single = (predicate = (() => true)) => stream => {
  let index = 0
  return baseCreate({
    next(x) {
      if (predicate(x, index)) {
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

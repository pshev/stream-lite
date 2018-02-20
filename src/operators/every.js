import {baseCreate, baseNext, baseComplete} from '../internal'

export const every = (predicate = (() => true)) => stream => {
  let index = 0
  return baseCreate({
    next(x) {
      if (!predicate(x, index)) {
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
    }
  }, stream)
}
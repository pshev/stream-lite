import {baseCreate, baseNext} from '../internal'

export const skipWhile = predicate => stream => {
  let index = 0
  let skipping = true

  return baseCreate({
    next(x) {
      if (!skipping)
        baseNext(this, x)
      else if (predicate(x, index) === false) {
        skipping = false
        baseNext(this, x)
      }
      index++
    },
    onStop() {
      index = 0
      skipping = true
    }
  }, stream)
}

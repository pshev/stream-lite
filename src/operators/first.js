import {baseCreate, baseNext, baseComplete} from '../internal'

export const first = (predicate, projectionFn = (x => x), defaultValue) => stream => {
  predicate = predicate || (() => true)
  let index = 0
  return baseCreate({
    next(x) {
      if (predicate(x, index)) {
        baseNext(this, projectionFn(x, index))
        baseComplete(this)
      }
      index++
    },
    complete() {
      baseNext(this, defaultValue)
      baseComplete(this)
    },
    onStop() {
      index = 0
    }
  }, stream)
}

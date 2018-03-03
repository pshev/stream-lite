import {baseCreate, baseNext, baseComplete} from '../internal'
import {_try, ERROR} from '../util/try'

export const last = (predicate, projectionFn = (x => x), defaultValue) => stream => {
  predicate = predicate || (() => true)
  let index = 0
  let lastToPassThePredicate
  return baseCreate({
    next(x) {
      const condition = _try(this, () => predicate(x, index))

      if (condition !== ERROR && condition)
        lastToPassThePredicate = {value: x, index}

      index++
    },
    complete() {
      const x = lastToPassThePredicate
        ? _try(this, () => projectionFn(lastToPassThePredicate.value, lastToPassThePredicate.index))
        : defaultValue
      if (x !== ERROR) {
        baseNext(this, x)
        baseComplete(this)
      }
    },
    onStop() {
      index = 0
      lastToPassThePredicate = null
    }
  }, stream)
}

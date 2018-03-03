import {Stream, baseNext, baseComplete} from '../internal'
import {_try, ERROR} from '../util/try'

export const first = (predicate, projectionFn = (x => x), defaultValue) => stream => {
  predicate = predicate || (() => true)
  let index = 0
  return Stream({
    next(x) {
      const condition = _try(this, () => predicate(x, index))
      if (condition === ERROR) return

      if (condition) {
        const projected = _try(this, () => projectionFn(x, index))

        if (projected !== ERROR) {
          baseNext(this, projected)
          baseComplete(this)
        }
      }
      index++
    },
    complete() {
      baseNext(this, defaultValue)
      baseComplete(this)
    },
    onStop() {
      index = 0
    },
    dependencies: [stream]
  })
}

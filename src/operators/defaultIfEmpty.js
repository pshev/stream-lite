import {baseCreate, baseNext, baseComplete} from '../internal'

export const defaultIfEmpty = defaultValue => stream => {
  let isEmpty = true

  return baseCreate({
    next(x) {
      isEmpty = false
      baseNext(this, x)
    },
    complete() {
      if (isEmpty)
        baseNext(this, defaultValue)

      baseComplete(this)
    },
    onStop() {
      isEmpty = true
    }
  }, stream)
}

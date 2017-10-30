import {baseCreate, baseNext, baseComplete, proto} from '../../core'

proto.defaultIfEmpty = function defaultIfEmpty(defaultValue) {
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
  }, this)
}

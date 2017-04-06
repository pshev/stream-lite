import {proto, baseCreate, baseNext, baseComplete} from '../../core'

proto.every = function every(predicate = (() => true)) {
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
    stop() {
      index = 0
    }
  }, this)
}

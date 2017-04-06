import {baseCreate, baseNext, proto} from '../../core'

proto.single = function single(predicate = (() => true)) {
  let index = 0
  return baseCreate({
    next(x) {
      if (predicate(x, index)) {
        baseNext(this, x)
        this.complete()
      }
      index++
    },
    stop() {
      index = 0
    }
  }, this)
}

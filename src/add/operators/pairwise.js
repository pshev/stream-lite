import {baseCreate, baseNext, proto} from '../../core'

proto.pairwise = function pairwise() {
  let prev
  let hasPrev = false
  return baseCreate({
    next(x) {
      if (hasPrev)
        baseNext(this, [prev, x])
      else
        hasPrev = true

      prev = x
    },
    stop() {
      prev = null
      hasPrev = false
    }
  }, this)
}

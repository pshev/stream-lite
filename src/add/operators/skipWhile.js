import {baseCreate, baseNext, proto} from '../../core'

proto.skipWhile = function skipWhile(predicate) {
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
  }, this)
}

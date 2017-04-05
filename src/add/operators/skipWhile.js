import {baseCreate, baseNext, proto} from '../../core'

proto.skipWhile = function skipWhile(predicate) {
  let index = 0
  let skipping = true
  return baseCreate({
    next: function(x) {
      if (!skipping)
        baseNext(this, x)
      else if (predicate(x, index) === false) {
        skipping = false
        baseNext(this, x)
      }
      index++
    },
    streamDeactivated: function() {
      index = 0
      skipping = true
    }
  }, this)
}

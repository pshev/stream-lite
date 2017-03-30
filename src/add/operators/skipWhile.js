import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

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
    }
  }, this)
}

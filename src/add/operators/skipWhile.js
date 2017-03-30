import proto, {defaultOnNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.skipWhile = function skipWhile(predicate) {
  let index = 0
  let skipping = true
  return baseCreate({
    next: function(x) {
      if (!skipping)
        defaultOnNext(this, x)
      else if (predicate(x, index) === false) {
        skipping = false
        defaultOnNext(this, x)
      }
      index++
    }
  }, this)
}

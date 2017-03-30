import {proto, baseNext} from '../../core'
import {baseCreate} from '../../core'

proto.do = function(fn) {
  return baseCreate({
    next: function(x) {
      fn(x)
      baseNext(this, x)
    }
  }, this, 'do')
}

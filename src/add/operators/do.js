import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.do = function(fn) {
  return baseCreate({
    next: function(x) {
      fn(x)
      baseNext(this, x)
    }
  }, this, 'do')
}

import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.filter = function filter(f) {
  return baseCreate({
    next: function(x) {
      if (f(x))
        baseNext(this, x)
    }
  }, this, 'filter')
}

import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.map = function(f) {
  return baseCreate({
    next: function(x) {
      baseNext(this, f(x))
    }
  }, this, 'map')
}

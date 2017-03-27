import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.map = function(f) {
  return baseCreate({
    next: function(x) {
      defaultOnNext(this, f(x))
    }
  }, this, 'map')
}

import proto, {baseNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.withValue = function withValue(fn) {
  return baseCreate({
    next: function(x) {
      baseNext(this, [x, fn(x)])
    }
  }, this, 'withValue')
}

import proto, {defaultOnNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.withValue = function withValue(fn) {
  return baseCreate({
    next: function(x) {
      defaultOnNext(this, [x, fn(x)])
    }
  }, this, 'withValue')
}

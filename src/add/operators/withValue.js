import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.withValue = function withValue(fn) {
  return baseCreate({
    next: function(x) {
      defaultOnNext(this, [x, fn()])
    }
  }, this, 'withValue')
}

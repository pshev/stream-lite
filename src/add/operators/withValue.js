import {baseCreate, baseNext, proto} from '../../core'

proto.withValue = function withValue(fn) {
  return baseCreate({
    next: function(x) {
      baseNext(this, [x, fn(x)])
    }
  }, this, 'withValue')
}

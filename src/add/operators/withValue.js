import {baseCreate, baseNext, proto} from '../../core'

proto.withValue = function withValue(fn) {
  return baseCreate({
    next(x) {
      baseNext(this, [x, fn(x)])
    }
  }, this, 'withValue')
}

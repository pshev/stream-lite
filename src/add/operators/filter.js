import {baseCreate, baseNext, proto} from '../../core'

proto.filter = function filter(f) {
  return baseCreate({
    next(x) {
      if (f(x))
        baseNext(this, x)
    }
  }, this, 'filter')
}

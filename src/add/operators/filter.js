import {baseCreate, baseNext, proto} from '../../core'

proto.filter = function filter(f) {
  return baseCreate({
    next: function(x) {
      if (f(x))
        baseNext(this, x)
    }
  }, this, 'filter')
}

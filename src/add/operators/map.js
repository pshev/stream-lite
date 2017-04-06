import {proto, baseNext} from '../../core'
import {baseCreate} from '../../core'

proto.map = function(f) {
  return baseCreate({
    next(x) {
      baseNext(this, f(x))
    }
  }, this, 'map')
}

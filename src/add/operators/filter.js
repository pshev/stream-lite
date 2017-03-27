import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.filter = function filter(f) {
  return baseCreate({
    next: function(x) {
      if (f(x))
        defaultOnNext(this, x)
    }
  }, this, 'filter')
}

import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.do = function(fn) {
  return baseCreate({
    next: function(x) {
      fn(x)
      defaultOnNext(this, x)
    }
  }, this, 'do')
}

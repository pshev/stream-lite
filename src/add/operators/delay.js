import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.delay = function delay(delay) {
  return baseCreate({
    next: function(x) {
      setTimeout(() => defaultOnNext(this, x), delay)
    }
  }, this, 'delay')
}

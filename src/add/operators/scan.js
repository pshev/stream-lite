import proto, {defaultOnNext} from '../../proto'
import {baseCreate} from '../../core'

proto.scan = function scan(f, acc) {
  const fn = x => (acc = f(acc, this.val))
  return baseCreate({
    next: function(x) {
      defaultOnNext(this, fn.apply(this, x))
    }
  }, this, 'scan')
}

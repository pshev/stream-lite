import {proto, baseNext} from '../../core'
import {baseCreate} from '../../core'

proto.scan = function scan(f, acc) {
  const fn = x => (acc = f(acc, this.val))
  return baseCreate({
    next: function(x) {
      baseNext(this, fn.call(this, x))
    }
  }, this, 'scan')
}

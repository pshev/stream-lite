import proto, {defaultOnNext} from '../../core/proto'
import {baseCreate} from '../../core'

proto.single = function single(predicate = (() => true)) {
  let index = 0
  return baseCreate({
    next: function(x) {
      if (predicate(x, index)) {
        defaultOnNext(this, x)
        this.complete()
      }
      index++
    }
  }, this)
}

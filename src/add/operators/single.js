import {baseCreate, baseNext, proto} from '../../core'

proto.single = function single(predicate = (() => true)) {
  let index = 0
  return baseCreate({
    next: function(x) {
      if (predicate(x, index)) {
        baseNext(this, x)
        this.complete()
      }
      index++
    },
    streamDeactivated: function() {
      index = 0
    }
  }, this)
}
